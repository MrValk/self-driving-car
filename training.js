class Training {
  constructor(maxGenerations, generationTime, generationCount, mutationRate) {
    this.generations = 0;
    this.maxGenerations = maxGenerations;
    this.generationTime = generationTime;
    this.generationCount = generationCount;
    this.mutationRate = mutationRate;

    this.#prepareCanvas();
    this.#startGeneration(this.cars);
  }

  async #startGeneration(members, bestPrev = []) {
    if (this.generations >= this.maxGenerations) return;

    if (bestPrev.length) {
      NeuralNetwork.mutate(bestPrev, this.mutationRate);

      members.map((member) => (member.brain = bestPrev));
    }

    this.#animate();

    setTimeout(() => {
      cancelAnimationFrame(this.animationId);

      // Save the best neural network in local storage
      localStorage.setItem("bestBrain", JSON.stringify(this.bestCar.brain));

      // Wipe the canvas
      this.carCtx.clearRect(0, 0, this.carCanvas.width, this.carCanvas.height);

      // Prepare it again
      this.#prepareCanvas();

      // Start the next generation
      this.generations++;
      this.#startGeneration(members, this.bestCar.brain);
    }, this.generationTime * 1000);
  }

  #prepareCanvas() {
    this.carCanvas = window.document.getElementById("carCanvas");
    this.carCanvas.width = 200;
    this.networkCanvas = window.document.getElementById("networkCanvas");
    this.networkCanvas.width = 700;

    this.carCtx = this.carCanvas.getContext("2d");
    this.networkCtx = this.networkCanvas.getContext("2d");

    this.road = new Road(this.carCanvas.width / 2, this.carCanvas.width * 0.9);

    this.cars = this.#generateCars(this.generationCount, this.road);
    this.bestCar = this.cars[0];
    const bestBrain = localStorage.getItem("bestBrain");
    if (bestBrain) {
      for (let i = 0; i < this.cars.length; i++) {
        this.cars[i].brain = JSON.parse(bestBrain);

        if (i) NeuralNetwork.mutate(this.cars[i].brain, 0.2);
      }

      this.bestCar.brain = JSON.parse(bestBrain);
    }

    const trafficGenerator = new TrafficGenerator(this.road, 30, 50);
    this.traffic = trafficGenerator.getTraffic();
  }

  #animate = (time) => {
    this.carCanvas.height = window.innerHeight;
    this.networkCanvas.height = window.innerHeight;

    this.traffic.forEach((trafficCar) =>
      trafficCar.update(this.road.borders, [])
    );

    this.cars.forEach((car) => car.update(this.road.borders, this.traffic));
    this.bestCar = this.#findBest();

    this.carCtx.save();
    this.carCtx.translate(0, -this.bestCar.y + this.carCanvas.height * 0.7);
    this.road.draw(this.carCtx);

    this.traffic.forEach((trafficCar) => trafficCar.draw(this.carCtx, "red"));

    this.carCtx.globalAlpha = 0.2;
    this.cars.forEach((car) => car.draw(this.carCtx));
    this.carCtx.globalAlpha = 1;
    this.bestCar.draw(this.carCtx, true);

    this.carCtx.restore();

    this.networkCtx.lineDashOffset = -time / 50;
    Visualizer.drawNetwork(this.networkCtx, this.bestCar.brain);
    this.animationId = requestAnimationFrame(this.#animate);
  };

  #findBest() {
    // const bestCar = this.cars.find(
    //   (car) => car.y == Math.min(...this.cars.map((car) => car.y))
    // );

    let bestCars = [];

    this.cars.forEach((car) => {
      if (car.points == Math.max(...this.cars.map((car) => car.points)))
        bestCars.push(car);
    });

    if (bestCars.length == 1) return bestCars[0];

    const bestCar = bestCars.find(
      (car) => car.y == Math.min(...this.cars.map((car) => car.y))
    );
    return bestCar;
  }

  #generateCars(n, road) {
    const cars = [];
    for (let i = 1; i <= n; i++) {
      cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI"));
    }
    return cars;
  }
}
