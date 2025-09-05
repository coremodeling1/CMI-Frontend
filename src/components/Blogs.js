import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/Blogs.css"; // separate CSS file for this component
import "../styles/responsive.css";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);

  const fetchBlogs = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/blogs");
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
        {/* Sidebar + Content */}
        <div className="blogs-sidebar-container">
          {/* Sidebar */}
          <div className="blogs-sidebar">
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
          </div>

          {/* Selected blog content */}
          <div className="blogs-content">
            {selectedBlog && (
              <div className="selected-blog">
                <h2 className="blog-title">{selectedBlog.title}</h2>
                {selectedBlog.media && (
                  selectedBlog.media.includes("video")
                  ? (
                    <video controls className="blog-video">
                      <source src={selectedBlog.media} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <img
                      src={selectedBlog.media}
                      alt={selectedBlog.title}
                      className="blog-image"
                    />
                  )
                )}
                <div className="blog-content">
                  <p>{selectedBlog.content}</p>
                </div>
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
