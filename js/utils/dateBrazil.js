export function dateBrazil(date){
    const dateSplitTime = date.split("T")
    const dateSplit = dateSplitTime[0].split("-")

    const dateArray = [dateSplit[2], dateSplit[1], dateSplit[0]].join('/')

    return dateArray
}

