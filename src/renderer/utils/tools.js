export const getTimes = (isoString, type) => {
    if (!isoString) return ''
    const date = new Date(isoString);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    if(type === 2){
        const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        console.log(formattedDate);
        return formattedDate;
    }
    const formattedDate = `${year}年${month}月${day}日 ${hours}时${minutes}分${seconds}秒`;
    console.log(formattedDate);
    return formattedDate;
}
