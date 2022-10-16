class _TimeUnit {
	readonly Year = 'year';
	readonly Month = 'month';
	readonly Week = 'week';
	readonly Day = 'day';
	readonly Hour = 'hour';
	readonly Minute = 'minute';
	readonly Second = 'second';

	isTimeUnit(any: any): boolean {
		if (typeof any == 'string' &&
			Object.values(TimeUnit).includes(any)) return true;
		else return false;
	}
}

const TimeUnit = new _TimeUnit();
type TimeUnit = string;

export default TimeUnit;