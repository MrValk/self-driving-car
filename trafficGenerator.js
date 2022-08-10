class TrafficGenerator {
  traffic = [];

  constructor(road, carWidth, carHeight, amount) {
    this.road = road;
    this.carWidth = carWidth;
    this.carHeight = carHeight;
    this.amount = amount;

    // We'll only add cars up to 10000 pixels high
    this.maxHeight = this.road.top;

    // Traffic generates in steps
    this.step = this.carHeight * 3;

    this.stepCount = Math.round(Math.abs(this.maxHeight) / this.step);
  }

  getTraffic() {
    let traffic = [];

    for (let i = 0; i < this.stepCount; i++) {
      //   console.log("Steps Done", i);

      // Row's y position
      const y = -(i + 1) * this.step;

      // Determine how many cars will be in this row
      const amount = randomIntBetween(0, this.road.laneCount - 1);

      if (!amount) continue;

      let fullLanes = [];

      // Try to find a non-occupied lane for each car
      // And add it to the traffic array
      for (let j = 0; j < amount; j++) {
        const lane = randomIntBetween(0, this.road.laneCount - 1);

        // Try to find a lane that isn't full
        if (fullLanes.length)
          while (fullLanes.includes(lane))
            lane = randomIntBetween(0, this.road.laneCount - 1);

        traffic.push(this.#createCar(lane, y, 2));
      }
    }

    return traffic;
  }

  #createCar(lane, y, speed) {
    const car = new Car(
      this.road.getLaneCenter(lane),
      y,
      30,
      50,
      "DUMMY",
      speed
    );
    return car;
  }
}
