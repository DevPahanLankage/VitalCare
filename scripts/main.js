// Calculator Widget Functionality
const calculator = document.getElementById("calculator");
const calculatorForm = document.getElementById("calculatorForm");
const insuranceType = document.getElementById("insuranceType");
const healthQuestions = document.getElementById("healthQuestions");
const vehicleQuestions = document.getElementById("vehicleQuestions");
const coverageInput = document.getElementById("coverage");
const coverageOutput = document.querySelector(".range-value");
const calculationResult = document.getElementById("calculationResult");

// Make calculator draggable
let isDragging = false;
let currentX;
let currentY;
let initialX;
let initialY;
let xOffset = 0;
let yOffset = 0;

const dragStart = (e) => {
  if (e.type === "touchstart") {
    initialX = e.touches[0].clientX - xOffset;
    initialY = e.touches[0].clientY - yOffset;
  } else {
    initialX = e.clientX - xOffset;
    initialY = e.clientY - yOffset;
  }

  if (e.target.closest(".widget-header")) {
    isDragging = true;
  }
};

const dragEnd = () => {
  isDragging = false;
};

const drag = (e) => {
  if (!isDragging) return;

  e.preventDefault();

  if (e.type === "touchmove") {
    currentX = e.touches[0].clientX - initialX;
    currentY = e.touches[0].clientY - initialY;
  } else {
    currentX = e.clientX - initialX;
    currentY = e.clientY - initialY;
  }

  xOffset = currentX;
  yOffset = currentY;

  setTranslate(currentX, currentY, calculator);
};

const setTranslate = (xPos, yPos, el) => {
  el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
};

calculator.addEventListener("touchstart", dragStart, false);
calculator.addEventListener("touchend", dragEnd, false);
calculator.addEventListener("touchmove", drag, false);
calculator.addEventListener("mousedown", dragStart, false);
calculator.addEventListener("mouseup", dragEnd, false);
calculator.addEventListener("mousemove", drag, false);

// Calculator Controls
document.querySelector(".minimize-widget").addEventListener("click", () => {
  calculator.classList.toggle("minimized");
});

document.querySelector(".close-widget").addEventListener("click", () => {
  calculator.classList.add("closed");
});

// Show/hide type-specific questions
insuranceType.addEventListener("change", () => {
  const type = insuranceType.value;
  healthQuestions.style.display = type === "health" ? "block" : "none";
  vehicleQuestions.style.display = type === "vehicle" ? "block" : "none";
});

// Update coverage value display
coverageInput.addEventListener("input", () => {
  const value = parseInt(coverageInput.value);
  coverageOutput.textContent = formatCurrency(value);
});

// Format currency
function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

// Calculate premium
function calculatePremium() {
  const type = insuranceType.value;
  const age = parseInt(document.getElementById("age").value);
  const coverage = parseInt(coverageInput.value);

  let basePremium = 0;
  let riskFactor = 0;
  let discount = 0;

  // Base calculations
  switch (type) {
    case "health":
      basePremium = coverage * 0.001;
      if (age > 50) riskFactor += basePremium * 0.2;
      if (document.querySelector('[name="smoker"]').checked) {
        riskFactor += basePremium * 0.3;
      }
      if (document.querySelector('[name="preExisting"]').checked) {
        riskFactor += basePremium * 0.25;
      }
      break;
    case "life":
      basePremium = coverage * 0.0015;
      if (age > 60) riskFactor += basePremium * 0.3;
      break;
    case "vehicle":
      basePremium = coverage * 0.002;
      const vehicleType = document.getElementById("vehicleType").value;
      if (vehicleType === "sports") riskFactor += basePremium * 0.4;
      if (vehicleType === "suv") riskFactor += basePremium * 0.2;
      break;
  }

  // Age-based discounts
  if (age < 25) discount = basePremium * 0.1;
  if (coverage > 500000) discount += basePremium * 0.05;

  return {
    basePremium: Math.round(basePremium),
    riskFactor: Math.round(riskFactor),
    discount: Math.round(discount),
    total: Math.round(basePremium + riskFactor - discount),
  };
}

// Handle form submission
calculatorForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const result = calculatePremium();

  // Update result display
  calculationResult.querySelector(".amount").textContent = formatCurrency(
    result.total
  );
  calculationResult.querySelector(".base-amount").textContent = formatCurrency(
    result.basePremium
  );
  calculationResult.querySelector(".risk-amount").textContent = formatCurrency(
    result.riskFactor
  );
  calculationResult.querySelector(
    ".discount-amount"
  ).textContent = `-${formatCurrency(result.discount)}`;

  // Show result
  calculatorForm.style.display = "none";
  calculationResult.classList.remove("hidden");
});

// Handle recalculate button
document.querySelector(".recalculate-btn").addEventListener("click", () => {
  calculatorForm.style.display = "block";
  calculationResult.classList.add("hidden");
});

// Handle get quote button
document.querySelector(".get-quote-btn").addEventListener("click", () => {
  // Implement quote request functionality
  alert(
    "Thank you for your interest! Our team will contact you shortly with a detailed quote."
  );
});

// ... rest of existing code ...
