const imageUpload = document.getElementById("imageUpload");
const preview = document.getElementById("preview");
const dropZone = document.getElementById("dropZone");
const dropIcon = document.getElementById("dropIcon");
const dropLabel = document.getElementById("dropLabel");
const dropHint = document.getElementById("dropHint");
const predictBtn = document.getElementById("predictBtn");
const loader = document.getElementById("loader");
const resultIdle = document.getElementById("resultIdle");
const resultContent = document.getElementById("resultContent");
const resultDiv = document.getElementById("result");
const resultBadge = document.getElementById("resultBadge");
const changeBtn = document.getElementById("changeBtn");

let currentFile = null;

function setImage(file) {
  if (!file.type.startsWith("image/")) {
    alert("Please select an image (JPEG, PNG, WEBP)");
    return;
  }
  currentFile = file;
  const url = URL.createObjectURL(file);
  preview.src = url;
  preview.classList.remove("hidden");
  preview.classList.add("block");

  // hide default drop content
  dropIcon.classList.add("hidden");
  dropLabel.classList.add("hidden");
  dropHint.classList.add("hidden");

  // enable predict button
  predictBtn.disabled = false;
  predictBtn.classList.remove("opacity-50", "scale-[0.98]");
  predictBtn.classList.add(
    "opacity-100",
    "scale-100",
    "hover:shadow-[0_0_50px_#3b82f6]",
  );

  // reset result area to idle
  resultContent.classList.add("hidden");
  resultIdle.classList.remove("hidden");
  loader.classList.add("hidden");
}

// open file picker on dropzone click (if no image)
dropZone.addEventListener("click", (e) => {
  if (e.target === changeBtn || changeBtn.contains(e.target)) return;
  if (!currentFile) imageUpload.click();
});

changeBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  imageUpload.click();
});

imageUpload.addEventListener("change", function () {
  if (this.files[0]) setImage(this.files[0]);
});

// drag & drop
dropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropZone.classList.add("border-blue-400", "bg-blue-900/30");
});
dropZone.addEventListener("dragleave", () => {
  dropZone.classList.remove("border-blue-400", "bg-blue-900/30");
});
dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropZone.classList.remove("border-blue-400", "bg-blue-900/30");
  if (e.dataTransfer.files[0]) setImage(e.dataTransfer.files[0]);
});

// analyze click
predictBtn.addEventListener("click", async () => {
  if (!currentFile) return;

  predictBtn.disabled = true;
  predictBtn.classList.add("opacity-50");
  loader.classList.remove("hidden");
  resultIdle.classList.add("hidden");
  resultContent.classList.add("hidden");

  const formData = new FormData();
  formData.append("file", currentFile);

  try {
    const response = await fetch("http://localhost:8000/predict", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();

    loader.classList.add("hidden");
    resultDiv.src = `/public/${data.prediction}.png`;
    resultBadge.innerText = `Score: ${data.score}`;
    resultBadge.classList.remove("border-red-500/70", "bg-red-950/50");
    resultBadge.classList.add("border-blue-500/70", "bg-blue-950/80");
  } catch (err) {
    loader.classList.add("hidden");
    resultDiv.innerText = `⚠️ offline demo`;
    // friendly mock result for responsiveness demonstration
    resultDiv.src = "/public/error.png";
    resultBadge.innerText = `Failed to Load!`;
    resultBadge.classList.remove("border-blue-500/70", "bg-blue-950/80");
    resultBadge.classList.add(
      "border-amber-500/70",
      "bg-amber-950/50",
      "text-amber-100",
    );
  }

  resultContent.classList.remove("hidden");
  predictBtn.disabled = false;
  predictBtn.classList.remove("opacity-50");
});
