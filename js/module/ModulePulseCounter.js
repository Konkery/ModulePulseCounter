/**
 * @class
 * Класс для работы с пульсовыми датчиками, осуществляющий подсчет импульсов на пине.
 * Предоставляет методы для запуска и остановки подсчета импульсов, а также получения информации о значениях счетчиков.
 */
class ClassPulseSensor extends ClassSensor {
    constructor(opts) {
        ClassSensor.call(this, opts);
        this._SetWatch;
        this._Interval = Array(2);
    }
    /**
     * @typedef {Object} InterruptOptions
     * @property {string} [edge='rising'] - на каком фронте будет срабатывать прерывание: 'rising' (передний), 'falling' (задний) или 'both' (оба).
     * @property {number} [debounce=0] - программный «антидребезг», заданный в миллисекундах.
     */
    /**
     * 
     * @param {Number} _chNum - номер канала (пина)
     * @param {InterruptOptions} _opts - параметры мониторинга прерываний
     * @returns 
     */
    Start(_chNum, _opts) {
        if (!(this._Pins[0] instanceof Pin)) return false;
        _opts.repeat = true;                                    // мониторинг не имеет смысла без установки repeat = true

        this.Ch0_Value = 0;
        this._SetWatch = setWatch(() => {
            this.Ch0_Value = this._Channels[_chNum].Value + 1;
        }, 
        this._Pins[0], _opts);
        
        let count_one_sec_ago = 0;
        let count_one_min_ago = 0;

        this._Interval[0] = setInterval(() => {
            if (this._ChStatus[0]) {
                this.Ch1_Value = this._Channels[0].Value - count_one_sec_ago; // импульсов за последний период
                count_one_sec_ago = this._Channels[0].Value;
            }
        }, 1000);

        this._Interval[1] = setInterval(() => {
            if (this._ChStatus[0]) {
                this.Ch2_Value = this._Channels[0].Value - count_one_min_ago; // импульсов за последний период
                count_one_min_ago = this._Channels[0].Value;
            }
        }, 60000);

        this._ChStatus[0] = 1;
        this._ChStatus[1] = 1;
        this._ChStatus[2] = 1;

        return true;
    }

    Stop(_chNum) {
        if (!this._SetWatch) return false;

        clearWatch(this._SetWatch);
        this._SetWatch = null;

        clearInterval(this._Interval[0]);
        clearInterval(this._Interval[1]);
        this._Interval[0] = null;
        this._Interval[1] = null;

        this._ChStatus[0] = 0;
        this._ChStatus[1] = 0;
        this._ChStatus[2] = 0;
        return true;
    }
}
exports = ClassPulseSensor;