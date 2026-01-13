import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/Blogs.css";
import "../styles/responsive.css";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);

  const fetchBlogs = async () => {
    try {
      const res = await axios.get(
        "https://cmi-backend-6xf1.onrender.com/api/blogs"
      );
      setBlogs(res.data);
      if (res.data.length > 0) setSelectedBlog(res.data[0]);
    } catch (err) {
      console.error(err);
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
          <div className="blogs-sidebar-container">
            {/* Sidebar */}
            <aside className="blogs-sidebar">
              <h3 className="sidebar-heading">Blogs</h3>
              {blogs.map((blog) => (
                <div
                  key={blog._id}
                  className={`blog-title-item ${
                    selectedBlog?._id === blog._id ? "active" : ""
                  }`}
                  onClick={() => setSelectedBlog(blog)}
                >
                  {blog.title}
                </div>
              ))}
            </aside>

            {/* Blog Content */}
            <div className="blogs-content">
              {selectedBlog && (
                <article className="selected-blog">
                  <h1 className="blog-title">{selectedBlog.title}</h1>

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

                  {/* ✅ Rich HTML Content */}
                  <section
                    className="blog-content"
                    dangerouslySetInnerHTML={{
                      __html: selectedBlog.content,
                    }}
                  />
                </article>
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
