const zoomButton = document.querySelector(".cv-zoom-button");
const cvDialog = document.querySelector(".cv-dialog");

if (zoomButton && cvDialog) {
  const closeButton = cvDialog.querySelector(".cv-dialog-close");

  zoomButton.addEventListener("click", () => cvDialog.showModal());
  closeButton.addEventListener("click", () => cvDialog.close());
  cvDialog.addEventListener("click", (event) => {
    if (event.target === cvDialog) cvDialog.close();
  });
}
