# Task 1: Calculator — OmniCalc Pro

**Track:** Web Development & Designing  
**Level:** Level 2  
**Project Name:** `WebDev-L2-Calculator`  
**Internship:** Oasis Infobyte SIP

---

## 🌟 Overview
OmniCalc Pro is a precision browser-based arithmetic calculator engineered with pure CSS Grid layout, event delegation, operator chaining support, zero `eval()` vulnerabilities, division-by-zero protection, interactive calculation history, and comprehensive keyboard bindings.

---

## ✨ Features Checklist
- [x] **Dual Display Screen:** Shows real-time entered values, active operations, and prior expressions.
- [x] **Numeric & Decimal Keys (0–9, .):** Prevents invalid multiple decimal points.
- [x] **Basic & Advanced Operators:** Addition (`+`), Subtraction (`-`), Multiplication (`×`), Division (`÷`), Sign Negation (`±`), and Percentage (`%`).
- [x] **Evaluation Engine (`=`):** Computes results using custom floating-point sanitised logic without using `eval()`.
- [x] **Clear & Delete Controls:** `AC` for full reset, `DEL` for character backspacing.
- [x] **Division-by-Zero Safety:** Displays `"Error: Division by 0"` instead of crashing or generating `Infinity`.
- [x] **Operator Chaining:** Supports continuous chaining (e.g. `5 + 3 × 2`) automatically computing intermediate operands.
- [x] **CSS Grid Alignment:** Precise 4-column responsive grid layout with glassmorphism elevation.
- [x] **Clean Event Listeners:** Zero inline `onclick` HTML attributes; utilizes event delegation pattern.
- [x] **Calculation History Drawer:** Stores recent computations with 1-click recall into the active display.
- [x] **Keyboard Input Integration:** Full support for typing numbers, operators, Enter, Backspace, and Escape.

---

## 🚀 How to Run Locally
1. Navigate to directory:
   ```bash
   cd OIBSIP/WebDev-L2-Calculator
   ```
2. Open `index.html` in any browser.
