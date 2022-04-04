const parent = document.querySelector('.notes');
const createNew = document.querySelector('#createNote');

createNew.addEventListener('click', () => {
    createNote();
})

function createElement(element, className) {
    const created = document.createElement(element);

    created.classList = className ? className : ''

    return created;
}

function renderNotes() {
    const notes = localStorage.getItem('notes');
    parent.innerHTML = '';

    if (notes) {
        JSON.parse(notes).forEach(note => {
            createNote(note);
        })
    }
}

function updateNotes() {
    const notesContent = document.querySelectorAll('textarea');
    const notes = [];

    notesContent.forEach(note => {
        notes.push(note.value);
    });

    localStorage.setItem('notes', JSON.stringify(notes));
}

function deleteNote(note) {
    const notes = localStorage.getItem('notes');
    const updated = JSON.parse(notes).filter(el => el !== note);
    localStorage.setItem('notes', JSON.stringify(updated));
    renderNotes();
}

function createNote(noteContent) {
    const note = createElement('div', 'note');
    const tools = createElement('div', 'tools');
    const editBtn = createElement('button');
    const editBtnIcon = createElement('i', 'fas fa-edit');
    const deleteBtn = createElement('button');
    const deleteBtnIcon = createElement('i', 'fas fa-trash-alt');
    const textArea = createElement('textarea', noteContent ? 'hidden' : '');
    const content = createElement('div', noteContent ? 'content' : 'content hidden');

    if (noteContent) {
        textArea.value = noteContent;
        content.innerHTML = marked.parse(noteContent);
    }

    editBtn.addEventListener('click', () => {
        textArea.classList.toggle('hidden');
        content.classList.toggle('hidden');
    })

    deleteBtn.addEventListener('click', (e) => {
        deleteNote(textArea.value);
    })

    textArea.addEventListener('input', (e) => {
        const {value} = e.target;

        content.innerHTML = marked.parse(value);
        updateNotes();
    })

    editBtn.append(editBtnIcon);
    deleteBtn.append(deleteBtnIcon);
    tools.append(editBtn, deleteBtn);
    note.append(tools, textArea, content);
    parent.append(note);
}

renderNotes();