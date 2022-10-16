class _TimeUnit {
    Year = 'year';
    Month = 'month';
    Week = 'week';
    Day = 'day';
    Hour = 'hour';
    Minute = 'minute';
    Second = 'second';
    isTimeUnit(any) {
        if (typeof any == 'string' &&
            Object.values(TimeUnit).includes(any))
            return true;
        else
            return false;
    }
}
const TimeUnit = new _TimeUnit();
export default TimeUnit;
