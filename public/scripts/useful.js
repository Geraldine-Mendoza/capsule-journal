function formatDate(date) {
    var cdate = new Date(date);
    if(cdate) return cdate.toLocaleDateString("en-US", { weekday: 'long', month: 'short', day: 'numeric' })
    console.log('error converting date')
    return date;
}