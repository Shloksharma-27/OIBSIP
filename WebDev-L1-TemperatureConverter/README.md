# Task 3: Temperature Converter Website — ThermoSync

**Track:** Web Development & Designing  
**Level:** Level 1  
**Project Name:** `WebDev-L1-TemperatureConverter`  
**Internship:** Oasis Infobyte SIP

---

## 🌟 Overview
ThermoSync is an interactive, real-time temperature conversion web tool that transforms temperatures between Celsius (°C), Fahrenheit (°F), and Kelvin (K). It features an interactive visual thermometer gauge, formula breakdowns, rapid benchmark presets, and physical edge-case enforcement (Absolute Zero validation).

---

## ✨ Features Checklist
- [x] **Numeric Input Field:** Validates and rejects non-numeric entries with instant user feedback.
- [x] **Source Unit Selector:** Toggle between Celsius, Fahrenheit, and Kelvin seamlessly.
- [x] **Simultaneous Multi-Unit Output:** Displays converted values across all target units instantly alongside the calculation formulas.
- [x] **Convert Button & Real-time Evaluation:** Triggers calculation on click or automatically as numbers are typed.
- [x] **Visual Thermometer Gauge:** Dynamic mercury fluid column adjusting height and color-coded temperature classifications (Freezing, Cold, Comfortable, Hot, Extreme Heat).
- [x] **Physics Edge-Case Handling:** Enforces thermodynamic Absolute Zero boundaries (-273.15°C, -459.67°F, 0 K) with an explanatory warning banner.
- [x] **Quick Preset Benchmarks:** 1-click presets for Freezing Point, Room Temperature, Body Temperature, Boiling Point, and Absolute Zero.
- [x] **Clean, Centred UI:** Modern glassmorphism layout with JetBrains Mono typography for numerical precision.

---

## 📐 Conversion Formulas Applied
1. **Celsius to Fahrenheit:** $F = (C \times \frac{9}{5}) + 32$
2. **Celsius to Kelvin:** $K = C + 273.15$
3. **Fahrenheit to Celsius:** $C = (F - 32) \times \frac{5}{9}$
4. **Fahrenheit to Kelvin:** $K = ((F - 32) \times \frac{5}{9}) + 273.15$
5. **Kelvin to Celsius:** $C = K - 273.15$
6. **Kelvin to Fahrenheit:** $F = ((K - 273.15) \times \frac{9}{5}) + 32$

---

## 🚀 How to Run Locally
1. Navigate to directory:
   ```bash
   cd OIBSIP/WebDev-L1-TemperatureConverter
   ```
2. Open `index.html` in any web browser.
