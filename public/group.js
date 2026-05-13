async function loadGroups() {
    const res = await fetch("/api/groups");
    const data = await res.json();

    data.forEach(g => {
        document.body.innerHTML += `<p>${g.name}</p>`;
    });
}

loadGroups();