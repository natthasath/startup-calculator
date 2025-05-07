document.addEventListener('DOMContentLoaded', () => {
    const result = document.getElementById('result');
    const buttons = document.querySelectorAll('button');
    
    let currentInput = '';
    let currentOperator = '';
    let previousInput = '';
    let calculationPerformed = false;
    
    // เพิ่ม event listener สำหรับทุกปุ่ม
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const value = button.textContent;
            
            if (button.classList.contains('number') || button.id === 'decimal') {
                handleNumberInput(value);
            } else if (button.classList.contains('operator')) {
                handleOperatorInput(button.id, value);
            }
            
            updateDisplay();
        });
    });
    
    // จัดการกับการกดตัวเลขและจุดทศนิยม
    function handleNumberInput(value) {
        // ถ้าเพิ่งคำนวณเสร็จและกดตัวเลขใหม่ ให้เริ่มใหม่
        if (calculationPerformed) {
            currentInput = '';
            calculationPerformed = false;
        }
        
        // ป้องกันการใส่จุดทศนิยมซ้ำ
        if (value === '.' && currentInput.includes('.')) {
            return;
        }
        
        // ถ้าเป็น 0 แล้วกดตัวเลขให้แทนที่ ยกเว้นกรณีจุดทศนิยม
        if (currentInput === '0' && value !== '.') {
            currentInput = value;
        } else {
            currentInput += value;
        }
    }
    
    // จัดการกับการกดปุ่มการคำนวณ
    function handleOperatorInput(id, value) {
        switch(id) {
            case 'clear':
                clearAll();
                break;
            case 'backspace':
                currentInput = currentInput.slice(0, -1);
                if (currentInput === '') {
                    currentInput = '0';
                }
                break;
            case 'equals':
                if (previousInput !== '' && currentInput !== '' && currentOperator !== '') {
                    calculate();
                    calculationPerformed = true;
                }
                break;
            case 'percent':
                if (currentInput !== '') {
                    currentInput = (parseFloat(currentInput) / 100).toString();
                }
                break;
            case 'add':
            case 'subtract':
            case 'multiply':
            case 'divide':
                if (currentInput !== '') {
                    if (previousInput !== '') {
                        calculate();
                    }
                    previousInput = currentInput;
                    currentInput = '';
                    currentOperator = id;
                }
                break;
        }
    }
    
    // คำนวณผลลัพธ์
    function calculate() {
        let calculation;
        const prev = parseFloat(previousInput);
        const current = parseFloat(currentInput);
        
        if (isNaN(prev) || isNaN(current)) return;
        
        switch(currentOperator) {
            case 'add':
                calculation = prev + current;
                break;
            case 'subtract':
                calculation = prev - current;
                break;
            case 'multiply':
                calculation = prev * current;
                break;
            case 'divide':
                if (current === 0) {
                    currentInput = 'Error';
                    previousInput = '';
                    currentOperator = '';
                    return;
                }
                calculation = prev / current;
                break;
            default:
                return;
        }
        
        // ปัดเศษทศนิยมที่ยาวเกินไป
        currentInput = calculation.toString();
        if (currentInput.includes('.') && currentInput.split('.')[1].length > 10) {
            currentInput = calculation.toFixed(10).replace(/\.?0+$/, '');
        }
        
        previousInput = '';
        currentOperator = '';
    }
    
    // ล้างทั้งหมด
    function clearAll() {
        currentInput = '0';
        previousInput = '';
        currentOperator = '';
    }
    
    // อัพเดทหน้าจอ
    function updateDisplay() {
        result.value = currentInput || '0';
    }
    
    // ตั้งค่าเริ่มต้น
    clearAll();
    updateDisplay();
    
    // เพิ่มการทำงานผ่านคีย์บอร์ด
    document.addEventListener('keydown', (event) => {
        const key = event.key;
        
        // ตัวเลขและจุดทศนิยม
        if (/^[0-9]$/.test(key) || key === '.') {
            handleNumberInput(key);
        }
        
        // ตัวดำเนินการ
        switch(key) {
            case '+':
                handleOperatorInput('add', '+');
                break;
            case '-':
                handleOperatorInput('subtract', '-');
                break;
            case '*':
                handleOperatorInput('multiply', '×');
                break;
            case '/':
                event.preventDefault(); // ป้องกันการเปิด quick find ในบางเบราว์เซอร์
                handleOperatorInput('divide', '÷');
                break;
            case 'Enter':
                handleOperatorInput('equals', '=');
                break;
            case 'Escape':
                handleOperatorInput('clear', 'C');
                break;
            case 'Backspace':
                handleOperatorInput('backspace', '⌫');
                break;
            case '%':
                handleOperatorInput('percent', '%');
                break;
        }
        
        updateDisplay();
    });
}); 