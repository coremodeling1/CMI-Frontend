import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/Blogs.css";
import "../styles/responsive.css";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "https://cmi-backend-6xf1.onrender.com/api/blogs"
      );
      setBlogs(res.data);
      if (res.data.length > 0) setSelectedBlog(res.data[0]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <>
      <Navbar />
      <div className="blogs-body">
        <div className="blogs-container sidebar-layout">
          {/* Page Header */}
          <div className="blogs-header">
            <h1 className="page-title">Our Blogs</h1>
            <p className="page-subtitle">
              Explore our latest insights, stories, and updates
            </p>
          </div>

          <div className="blogs-sidebar-container">
            {/* Sidebar */}
            <aside className="blogs-sidebar">
              <h3 className="sidebar-heading">All Blogs</h3>
              {loading ? (
                <div className="loading-state">Loading blogs...</div>
              ) : blogs.length === 0 ? (
                <div className="empty-state">
                  <p>No blogs available yet.</p>
                  <p>Check back soon!</p>
                </div>
              ) : (
                blogs.map((blog) => (
                  <div
                    key={blog._id}
                    className={`blog-title-item ${
                      selectedBlog?._id === blog._id ? "active" : ""
                    }`}
                    onClick={() => setSelectedBlog(blog)}
                  >
                    {blog.title}
                  </div>
                ))
              )}
            </aside>

            {/* Blog Content */}
            <div className="blogs-content">
              {selectedBlog ? (
                <article className="selected-blog">
                  <h1 className="blog-title">{selectedBlog.title}</h1>

                  {/* Blog Date */}
                  <div className="blog-meta">
                    <span className="blog-date">
                      {new Date(selectedBlog.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </span>
                  </div>

                  {selectedBlog.media &&
                    (selectedBlog.media.includes("video") ? (
                      <video controls className="blog-video">
                        <source
                          src={selectedBlog.media}
                          type="video/mp4"
                        />
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <img
                        src={selectedBlog.media}
                        alt={selectedBlog.title}
                        className="blog-image"
                      />
                    ))}

                  {/* Rich HTML Content */}
                  <section
                    className="blog-content"
                    dangerouslySetInnerHTML={{
                      __html: selectedBlog.content,
                    }}
                  />
                </article>
              ) : (
                <div className="no-selection">
                  <h2>No Blog Selected</h2>
                  <p>Select a blog from the sidebar to read</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Blogs;