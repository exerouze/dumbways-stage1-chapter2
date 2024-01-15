const projects = [];

function addProject(e) {
  e.preventDefault();

  const projectName = document.getElementById("project-name").value;
  const startDate = document.getElementById("start-date").value;
  const endDate = document.getElementById("end-date").value;
  const description = document.getElementById("project-desc").value;
  let upImage = document.getElementById("project-image").files;
  upImage = URL.createObjectURL(upImage[0]);
  const checkedTech = document.querySelectorAll('input[name="tech"]:checked');

  const techValues = Array.from(checkedTech).map((tech) => tech.value);

  const project = {
    projectName,
    startDate,
    endDate,
    description,
    upImage,
    techValues,
  };

  projects.unshift(project);
  renderProject();

  console.log("project", project);
}

function renderProject() {
  let html = "";

  for (let index = 0; index < projects.length; index++) {
    let icon = "";

    for (let i = 0; i < projects[index].techValues.length; i++) {
      const tech = projects[index].techValues[i];

      if (tech === "reactjs") {
        icon += `<i class="fa-brands fa-react"></i>`;
      }
      if (tech === "nodejs") {
        icon += `<i class="fa-brands fa-node-js"></i>`;
      }
      if (tech === "python") {
        icon += `<i class="fa-brands fa-python"></i>`;
      }
      if (tech === "golang") {
        icon += `<i class="fa-brands fa-golang"></i>`;
      }
    }

    // Hitung total bulan
    const startDate = new Date(projects[index].startDate);
    const endDate = new Date(projects[index].endDate);
    const totalMonths =
      (endDate.getFullYear() - startDate.getFullYear()) * 12 +
      (endDate.getMonth() - startDate.getMonth());

    html += `
            <div class="project-item">
                <div class="project-image">
                    <img src="${projects[index].upImage}" alt="Project Image">
                </div>
                <div class="project-content">
                    <h1>
                        <a href="project-detail.html" target="_blank">${projects[index].projectName}</a>
                    </h1>
                    <div class="detail-project-content">
                        Duration : ${totalMonths} Month
                    </div>
                    <div class="p-project-content">
                        <p>
                            ${projects[index].description}
                        </p>
                    </div>
                    <div class="icon-checkbox">
                        ${icon}
                    </div>
                    <div class="btn-group">
                        <button class="btn-edit">Edit Post</button>
                        <button class="btn-post">Delete Post</button>
                    </div>
                </div>
            </div>`;
  }

  document.getElementById("project-list").innerHTML = html;
}

renderProject();
