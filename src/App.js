const markupRemover = require('./markupRemover')
const fs = require('fs')
const readline = require('readline');

module.exports = class App {
    readFile(inputPath) {
        return new Promise((resolve, reject) => {
            fs.readFile(inputPath, (err, data) =>  {
                if(err)
                    reject(err)
                this.fileContents = data.toString()
                resolve(this.fileContents)
            })
        })
    }

    writeResults(outputPath) {
        return new Promise((resolve, reject) => {
            fs.writeFile(outputPath, this.markupLessText, (err) => {
                if(err)
                    reject(err)
                resolve()
            })
        })
    }

    async run() {
        this.inputPath = ''
        this.outputPath = ''
        let rl = readline.createInterface(
            {
                input: process.stdin,
                output: process.stdout
            }
        )

        let pathsReceivedPromise = new Promise((resolve) => 
        {
            rl.question('Please enter path to original file: ', res => {
                this.inputPath = res

                rl.close()
                resolve()
            })
        })
        pathsReceivedPromise = new Promise((resolve) => {
            pathsReceivedPromise.then(() => {
                rl = readline.createInterface(
                    {
                        input: process.stdin,
                        output: process.stdout
                    }
                )
                rl.question('Please enter path to output file: ', res => {
                    this.outputPath = res
        
                    rl.close()
                    resolve()
                })
            })
        })

        pathsReceivedPromise.then(() => {
            this.readFile(this.inputPath).then(() => {
                let mr = new markupRemover(this.fileContents, '*')
                this.markupLessText = mr.removeMarkup()
            }).then(() => {
                this.writeResults(this.outputPath)
            }).catch(err => {
                throw err
            })
        })  
    }
}