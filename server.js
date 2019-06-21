var express = require('express')
var app = express()
var fetch = require('isomorphic-fetch')

const FigmaAPIKey = '15371-19293d70-15cb-41cf-9a79-48994020bf3f'
const FigmaFileID = `UqyZSNBgTAdBSRsETLaoDPBq`

async function figmaFileFetch(fileId) {
    let result = await fetch('https://api.figma.com/v1/files/' + fileId, {
        method: 'GET',
        headers: {
            'X-Figma-Token': FigmaAPIKey
        }
    }).catch(error => console.log(error))

    let figmaFileStruct = await result.json()

    let figmaFrames = figmaFileStruct.document.children // 1
        .filter(child => child.type === 'CANVAS')[6].children // 2
        .filter(child => child.type === 'COMPONENT') // 3
        .map(component => { // 4
            return {
                name: component.name,
                id: component.id
            }
    })
    let ids = figmaFrames.map(comp => comp.id).join(',')
    let imageResult = await fetch('https://api.figma.com/v1/images/' + fileId + '?scale=3&ids=' + ids, { //2
    method: 'GET', //2
    headers: { 
        'X-Figma-Token': FigmaAPIKey //2
    }
}).catch(error => console.log(error))
let figmaImages = await imageResult.json() //3

figmaImages = figmaImages.images //4
console.log(JSON.stringify(figmaImages)) //4

return figmaFrames.map(frame => {
    return {
        name: frame.name,//5
        url: figmaImages[frame.id]//5
    }
})
}
// app.use('/', async function (req, res, next) {
//     let result = await figmaFileFetch(FigmaFileID).catch(error => console.log(error))
//     res.send(JSON.stringify(result))
// })

app.use('/components', async function (req, res, next) {
    let result = await figmaFileFetch(FigmaFileID).catch(error => console.log(error))
    res.send(result)
})

app.listen(3001, console.log("Holy shit, I'm a server and I am listening on port 3001"))