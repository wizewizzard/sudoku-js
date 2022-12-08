function Timer() {
    let isRunning = false;
    let paused = false;
    let startedAt = 0;
    let pausedAt = 0;
    let stoppedAt = 0;

    this.start = function () {
        if (isRunning)
            throw new Error('Timer is already running');
        paused = false;
        startedAt = new Date();
        isRunning = true;
    }

    this.stop = function () {
        if (!isRunning)
            throw new Error('Timer is not running');
        isRunning = null;
        stoppedAt = new Date();
    }

    this.pause = function () {
        if (!isRunning)
            throw new Error('Timer is not running');
        if (!paused) {
            paused = true;
            pausedAt = new Date();
        }
    }

    this.unpause = function () {
        if (!isRunning)
            throw new Error('Timer is not running');
        if (paused) {
            startedAt = new Date(startedAt.getTime() + new Date().getTime() - pausedAt.getTime());
            paused = false;
        }
    }

    this.getTime = function () {
        if (!isRunning) {
            throw new Error('Timer is not running');
        }
        if (!paused) {
            return new Date().getTime() - startedAt.getTime();
        }
        else {
            return pausedAt - startedAt;
        }
    }

    this.asHMSMs = function () {
        let intermedValue = this.getTime();
        const ms = intermedValue % 1000;
        intermedValue = Math.round((intermedValue - ms) / 1000);
        const s = intermedValue % 60;
        intermedValue = Math.round((intermedValue - s) / 60);
        const m = Math.round(intermedValue % 60);
        const h = Math.round((intermedValue - m) / 60);
        return { h, m, s, ms };
    }
}

export default Timer;