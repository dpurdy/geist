function padTwo (dayOrMonth)
{
	if(dayOrMonth.toString().length == 1) { dayOrMonth = "0" + dayOrMonth; }

	return dayOrMonth;
}

function padFive (year)
{
	if(year.toString().length == 4) { year = "0" + year; }

	return year;
}

function today()
{
	var now = new Date();
	var day =  padTwo(now.getDate());
	var month = padTwo(now.getMonth());
	var year = padFive(now.getFullYear());

	return year + "." + month + "." + day;
}
