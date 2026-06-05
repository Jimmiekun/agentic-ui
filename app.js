/**

* Agentic UI Engine - Frontend Controller
* Sends prompts to backend and renders generated UI
  */

// Element Cache
const promptInput = document.getElementById("user-prompt");
const generateButton = document.getElementById("generate-btn");
const viewport = document.getElementById("ai-controlled-viewport");
const presetButtons = document.querySelectorAll(".preset-btn");

// Event Listeners
generateButton.addEventListener("click", processEngineExecution);

promptInput.addEventListener("keydown", (event) => {
if (event.key === "Enter") {
processEngineExecution();
}
});

// Preset Buttons
presetButtons.forEach((button) => {
button.addEventListener("click", () => {
const cleanedText = button.textContent
.replace(
/[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDC00-\uDFFF]/g,
""
)
.trim();

promptInput.value = `Create a ${cleanedText.toLowerCase()}`;
promptInput.focus();

});
});

/**

* Main Engine Function
  */
  async function processEngineExecution() {
  const userPrompt = promptInput.value.trim();

if (!userPrompt) {
alert(
"Action Required: Please type a UI prompt before generating."
);
return;
}

setLoadingState(true);

try {
const response = await fetch("/generate-ui", {
method: "POST",
headers: {
"Content-Type": "application/json",
},
body: JSON.stringify({
prompt: userPrompt,
}),
});

if (!response.ok) {
  throw new Error(
    `Server Error (${response.status})`
  );
}

const data = await response.json();

if (!data.success) {
  throw new Error(
    data.error || "Unknown backend error"
  );
}

if (!data.html) {
  throw new Error(
    "Backend returned no HTML."
  );
}

viewport.innerHTML = data.html;

} catch (error) {
console.error("Generation Error:", error);

viewport.innerHTML = `
  <div class="max-w-md p-6 bg-red-950/40 border border-red-800 rounded-xl text-left text-red-200">
    <h4 class="font-bold text-lg mb-2">
      ⚠️ Engine Compile Failure
    </h4>

    <p class="text-sm text-red-300/80 mb-3">
      The AI engine could not generate the interface.
    </p>

    <div class="text-xs font-mono bg-black/40 p-3 rounded border border-red-900/60 overflow-x-auto">
      ${error.message}
    </div>
  </div>
`;

} finally {
setLoadingState(false);
}
}

/**

* Loading State Controller
  */
  function setLoadingState(isLoading) {
  if (isLoading) {
  generateButton.disabled = true;
  
  generateButton.classList.add(
  "opacity-50",
  "cursor-not-allowed"
  );
  
  viewport.innerHTML = `
  
     <div class="flex flex-col items-center gap-4 p-8 ai-processing-glow">
     <div class="w-12 h-12 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin"></div> <div class="text-center">
   <p class="text-blue-400 font-bold tracking-wide">
     Compiling Prompt...
   </p>

   <p class="text-xs text-gray-500 mt-1">
     AI engine is generating interface markup...
   </p>
 </div>
  
     </div>
 `;

} else {
generateButton.disabled = false;

generateButton.classList.remove(
  "opacity-50",
  "cursor-not-allowed"
);

}
}