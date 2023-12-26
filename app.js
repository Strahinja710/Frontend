const BASE_URL = "http://192.168.104.101:8000/"

const fetchData = async () => {
    try {
        const response = await fetch(`${BASE_URL}students/`)
        console.log(response)
        const data = await response.json()
        console.log(data)
        let table = document.getElementById("tableBody")
        table.innerHTML = null // da se ne slažu novi redovi ponovo na stare

        data?.forEach(student => {
            let row =
                `
            <tr>
                <td>${student?.id}</td>
                <td>${student?.name}</td>
                <td>${student?.age}</td>
                <td>${student?.grade}</td>
                <td>${student?.enrollment_date}</td>
                <td><button type="button" onClick="deleteItem(${student?.id.toString()})">DELETE</button></td>
                <td><button onClick="selectStudent(${student?.id.toString()})">SELECT</button></td>
            </tr>
            `
            table.innerHTML += row
        })
    } catch (error) {
        console.log("Error happened:", error?.message);
    }
}

const deleteItem = async (studentId) => {
    try {
        const response = await fetch(`${BASE_URL}students/${studentId}`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
            },
        })

        if (response.ok) {
            alert(`Izbrisan student sa id: ${studentId}`)
        } else {
            throw new Error('Network response was not ok.')
        }
    } catch (err) {
        alert("Can't delete student!")
    }

    fetchData()
}

const saveStudent = async (e) => {
    e.preventDefault()

    const data = {
        name: document.getElementById("name").value,
        age: document.getElementById("age").value,
        grade: document.getElementById("grade").value,
        enrollment_date: document.getElementById("enrollmentDate").value
    }

    try {
        const response = await fetch(`${BASE_URL}students`, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-type": "application/json"
            }
        })

        if (response.ok) {
            alert(`Student added: ${data?.name}`)
        } else {
            throw new Error('Network response was not ok.')
        }
    } catch (err) {
        alert("Can't save student!")
    }

    fetchData()
}

let selectedStudentId = null

const selectStudent = async (studentId) => {
    try {
        const response = await fetch(`${BASE_URL}students/${studentId}`)
        const data = await response.json()

        document.getElementById("nameUpdate").value = data?.name
        document.getElementById("ageUpdate").value = data?.age
        document.getElementById("gradeUpdate").value = data?.grade
        document.getElementById("enrollmentDateUpdate").value = data?.enrollment_date

        if (!response.ok) {
            throw new Error('Network response was not ok.')
        }else{
            selectedStudentId = studentId
        }
    } catch (err) {
        alert("Can't select student!")
    }
}

const updateStudent = async (e) => {
    e.preventDefault()

    if(!selectedStudentId) return

    const data = {
        name: document.getElementById("nameUpdate").value,
        age: document.getElementById("ageUpdate").value,
        grade: document.getElementById("gradeUpdate").value,
        enrollment_date: document.getElementById("enrollmentDateUpdate").value
    }

    try {
        const response = await fetch(`${BASE_URL}students/${selectedStudentId}`, {
            method: "PUT",
            body: JSON.stringify(data),
            headers: {
                "Content-type": "application/json"
            }
        })

        if (response.ok) {
            alert(`Student updated: ${data?.name}`)
        } else {
            throw new Error('Network response was not ok.')
        }
    } catch (err) {
        alert("Can't update student! There is no student with this id!")
    }

    fetchData()
}

document.getElementById('inputForm').addEventListener('submit', saveStudent)
document.getElementById('updateForm').addEventListener('submit', updateStudent)

fetchData()