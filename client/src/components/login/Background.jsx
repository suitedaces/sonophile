import { useEffect } from 'react';
import p5 from 'p5';

export function Background() {
  let canvasRef;

  const setCanvasRef = (node) => {
    canvasRef = node;
  };

  useEffect(() => {
    const sketch = (p) => {
      let origin;
      let frame = 0;
      let flyBoxCount = 20;
      let flyBoxes = [];
      let flyBoxPause = 200;
      let flyBoxColors = [];

      p.setup = function () {
        p.createCanvas(p.windowWidth, p.windowHeight);
        origin = p.createVector(p.windowWidth / 2, p.windowHeight / 2);

        for (let i = -flyBoxCount / 2; i < flyBoxCount / 2; i++) {
          let box = createFlyBox(i);
          box.start();
          flyBoxes.push(box);
        }

        flyBoxColors.push(p.color('#1ED760'));
        flyBoxColors.push(p.color('#f23a58'));
        flyBoxColors.push(p.color('#caf23a'));
      };

      p.draw = function () {
        p.rectMode(p.CENTER);
        for (let i = 0; i < flyBoxCount; i++) {
          let flyBox = flyBoxes[i];
          flyBox.draw();
        }

        p.stroke(0, 0, 0);
        p.strokeWeight(40);
        p.noFill();
        p.translate(origin.x, origin.y);
        p.rotate((p.sin(frame * 0.02) + p.cos(frame * 0.03)) * p.PI);

        frame += 1;
      };

      p.windowResized = function () {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
        origin = p.createVector(p.windowWidth / 2, p.windowHeight / 2);
      };

      function createFlyBox(offset) {
        return {
          offset: offset,
          delay: 0,
          getRandomDelay: () => { return p.random(0, flyBoxCount) * 15; },
          steps: 0,
          directions: [p.createVector(-1, -1), p.createVector(-1, 1), p.createVector(1, -1), p.createVector(1, 1)],
          currentDirection: 0,
          iteration: 0,
          size: 80,
          start: function () {
            this.delay = this.getRandomDelay();
            this.steps = -this.delay;
          },
          draw: function () {
            this.steps += 20;

            if (this.steps < 0) {
              return;
            }

            p.fill(flyBoxColors[this.iteration]);
            p.noStroke();
            let dir = this.directions[this.currentDirection];
            p.rect(
              -dir.x * this.steps + origin.x + dir.x * origin.x - dir.x * this.offset * (this.size * 0.75),
              -dir.y * this.steps + origin.y + dir.y * origin.y + dir.y * this.offset * (this.size * 0.75),
              this.size, this.size);

            if (this.steps > Math.max(p.windowWidth, p.windowHeight)) {
              let newDelay = this.getRandomDelay();
              this.steps = -flyBoxPause + this.delay - newDelay;
              this.delay = newDelay;
              this.currentDirection = (this.currentDirection + 1) % 4;
              this.iteration = (this.iteration + 1) % flyBoxColors.length;
            }
          }
        };
      }
    };

    let myp5 = null;
    if (canvasRef) {
      myp5 = new p5(sketch, canvasRef);
    }

    return () => {
      if (myp5) {
        myp5.remove();
      }
    };
  });

  return <div ref={setCanvasRef} className="absolute top-0 left-0 w-full h-full bg-gray-800"></div>;
}

export default Background;