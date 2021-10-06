const fs = require("fs")
const path = require("path")
const crypto = require("crypto")


const dbPath = path.join(__dirname, "..", "db")

const readDB = (tableName) => {
    try {
        const filePath = path.join(dbPath, tableName + ".json")
        const fileData = fs.readFileSync(filePath)
        return JSON.parse(fileData.toString())
    } catch (error) {
        throw new Error(error)
    }
}

const writeDB = (tableName, data) => {
    try {
        const filePath = path.join(dbPath, tableName + ".json")
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
        return "Data updated"
    } catch (error) {
        throw new Error(error)
    }
}

const Select = (from, match, data) => {
    const table = readDB(from)
    return match && data ? table.find(d => d[match].toString() === data) : table;
}

const Insert = (into, data) => {
    let table = readDB(into);
    table.push({ id: crypto.randomBytes(16).toString("hex"), ...data })
    writeDB(into, table);
}

const Update = (into, where, id, data) => {
    let table = readDB(into);
    table = table.map((d) => {
        if (d[where].toString() === id) {
            return data;
        } else return d;
    })
    writeDB(into, table);
}

const Delete = (into, where, id) => {
    let table = readDB(into);
    table = table.filter((d) => {
        if (d[where].toString() === id) {
            return false;
        } else return true;
    })
    writeDB(into, table);
    return "User Deleted"
} 



const operations = { Select, Insert,Update,Delete}


module.exports = { readDB, writeDB, operations }