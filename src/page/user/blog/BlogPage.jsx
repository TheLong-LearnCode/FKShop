import React, { useEffect, useState } from 'react'
import '../../../util/GlobalStyle/GlobalStyle.css';
import './BlogPage.css';
import api from '../../../config/axios';
import { GET } from '../../../constants/httpMethod';
import { Link } from 'react-router-dom';

export default function BlogPage() {
    const [blogs, setBlogs] = useState(null);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const response = await api[GET]('/blogs');
                setBlogs(response.data);
            } catch (err) {
                console.error("Error fetching lab details: ", err);
            }
        }
        fetchBlog();

    }, [])

    console.log('BLOG', blogs)


    return (
        <div className='fixed-header text-center'>
            <h1 style={{ color: '#B43F3F' }}>Blog <box-icon name='blogger' type='logo' animation='burst' color='#b43f3f' ></box-icon></h1>
            <div className='blog-container container'>
                <div className="row">
                    {blogs && blogs.map((blog) => (
                        (blog.blog.status === 'published' &&
                            <div className="col-lg-3 col-md-4" key={blog.blog.blogID}>
                                <div className="blog-card">
                                    <h3 style={{ color: '#000F8F' }}>{blog.blog.blogName}</h3>
                                    <Link to={`/blog/${blog.blog.blogID}`}>Read It</Link>
                                    <div style={{ fontSize: '0.8rem', color: '#B19615' }}>
                                        <box-icon name='purchase-tag' type='solid' animation='tada' color='#B19615' ></box-icon>
                                        {blog.tags.map((tag) => (
                                            <span key={tag.tagID}
                                            >{
                                                    tag.tagName}
                                            </span>
                                        )).reduce((prev, curr) => [prev, ', ', curr])
                                        }
                                    </div>
                                </div>
                            </div>
                        )
                    )
                    )}
                </div>

            </div>
        </div>
    )
}
