export function dateAmerican(date){
    const dateSplit = date.split("/")

    const dateArray = [dateSplit[2], dateSplit[1], dateSplit[0]].join('-')

    return dateArray
}
