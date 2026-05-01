import { useEffect, useState } from "react";
import Message from "../components/Message.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import api, { getApiError } from "../services/api";

const emptyProjectForm = {
  name: "",
  description: "",
  members: ""
};

function Projects() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const [projects, setProjects] = useState([]);
  const [projectForm, setProjectForm] = useState(emptyProjectForm);
  const [memberForms, setMemberForms] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    setError("");
    try {
      const response = await api.get("/projects");
      setProjects(response.data.data.projects || []);
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleProjectChange = (event) => {
    setProjectForm((current) => ({
      ...current,
      [event.target.name]: event.target.value
    }));
  };

  const createProject = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    const members = projectForm.members
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean);

    try {
      await api.post("/projects", {
        name: projectForm.name,
        description: projectForm.description,
        members
      });
      setProjectForm(emptyProjectForm);
      setSuccess("Project created.");
      fetchProjects();
    } catch (err) {
      setError(getApiError(err));
    }
  };

  const updateMember = async (projectId, userId, action) => {
    if (!userId) {
      setError("User ID is required.");
      return;
    }

    setError("");
    setSuccess("");

    try {
      await api.put(`/projects/${projectId}/members`, { userId, action });
      setMemberForms((current) => ({ ...current, [projectId]: "" }));
      setSuccess(`Member ${action === "add" ? "added" : "removed"}.`);
      fetchProjects();
    } catch (err) {
      setError(getApiError(err));
    }
  };

  return (
    <section>
      <div className="page-header">
        <h2>Projects</h2>
      </div>
      <Message error={error} success={success} />

      {isAdmin && (
        <form className="panel form-grid" onSubmit={createProject}>
          <h3>Create project</h3>
          <label>
            Name
            <input
              name="name"
              value={projectForm.name}
              onChange={handleProjectChange}
              required
            />
          </label>
          <label>
            Description
            <textarea
              name="description"
              value={projectForm.description}
              onChange={handleProjectChange}
              rows="3"
            />
          </label>
          <label>
            Member IDs, comma separated
            <input
              name="members"
              value={projectForm.members}
              onChange={handleProjectChange}
              placeholder="Optional"
            />
          </label>
          <button type="submit">Create project</button>
        </form>
      )}

      {loading ? (
        <p>Loading projects...</p>
      ) : (
        <div className="stack">
          {projects.map((project) => (
            <article className="panel" key={project._id}>
              <div className="item-header">
                <div>
                  <h3>{project.name}</h3>
                  <p>{project.description || "No description"}</p>
                </div>
                <small>ID: {project._id}</small>
              </div>

              <h4>Members</h4>
              {project.members?.length ? (
                <ul className="list vertical">
                  {project.members.map((member) => (
                    <li key={member._id}>
                      <span>
                        {member.name} ({member.email}) · {member.role}
                      </span>
                      <small>{member._id}</small>
                      {isAdmin && member._id !== project.createdBy?._id && (
                        <button
                          type="button"
                          onClick={() =>
                            updateMember(project._id, member._id, "remove")
                          }
                        >
                          Remove
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No members.</p>
              )}

              {isAdmin && (
                <div className="inline-form">
                  <input
                    value={memberForms[project._id] || ""}
                    onChange={(event) =>
                      setMemberForms((current) => ({
                        ...current,
                        [project._id]: event.target.value
                      }))
                    }
                    placeholder="User ID"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      updateMember(
                        project._id,
                        memberForms[project._id],
                        "add"
                      )
                    }
                  >
                    Add member
                  </button>
                </div>
              )}
            </article>
          ))}
          {!projects.length && <p>No projects found.</p>}
        </div>
      )}
    </section>
  );
}

export default Projects;
