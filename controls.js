class Controls {
  constructor(type) {
    this.forward = false;
    this.left = false;
    this.right = false;
    this.reverse = false;

    switch (type) {
      case "KEYS":
        this.#addKeyboardListeners();
        break;
      case "DUMMY":
        this.forward = true;
        break;
    }
  }

  #addKeyboardListeners() {
    document.addEventListener("keydown", (e) => {
      switch (e.code) {
        case "KeyA":
          this.left = true;
          break;
        case "KeyD":
          this.right = true;
          break;
        case "KeyW":
          this.forward = true;
          break;
        case "KeyS":
          this.reverse = true;
          break;
      }
    });

    document.addEventListener("keyup", (e) => {
      switch (e.code) {
        case "KeyA":
          this.left = false;
          break;
        case "KeyD":
          this.right = false;
          break;
        case "KeyW":
          this.forward = false;
          break;
        case "KeyS":
          this.reverse = false;
          break;
      }
    });
  }
}
