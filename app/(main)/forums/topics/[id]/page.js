import React from "react";

export default function page() {
    return (
        <div className="content">
            <div className="head-disc">
                <div className="title">
                    <h3>Discussion about Full-Stack Development Internship</h3>
                    <span>
                        Author: <a href="#">Ali Ahmed</a>
                        <i className="icon-dot"></i>
                        <span>
                            <time datetime="date">2024-08-10 01:18:23</time>
                        </span>
                    </span>
                </div>
                <div className="disc-box">
                    <p>
                        Hey everyone, I'm really interested in the Full-Stack
                        Developer Internshipat Zain Sudan. Has anyone applied or
                        have any insights about the interview process or what
                        kind of projects interns usually work on?
                    </p>
                </div>
            </div>
            <div className="disc-content">
                <div className="replies">
                    <div className="title">
                        <h4>Replies</h4>
                        <span>(3)</span>
                    </div>
                    <div className="replies-content">
                        <div className="reply-box">
                            <img src="./img/avatar1.jpg" alt="" />
                            <div className="box">
                                <div className="name-time-disc">
                                    <span>Omer Saeed</span>
                                    <p>4 days ago</p>
                                </div>
                                <div className="disc-box">
                                    <p>
                                        Hi Ali, I applied last year . the first
                                        interview was mostly about your
                                        technical skills and understanding of
                                        basic programming concept. they might
                                        ask you about your projects.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="reply-box">
                            <img src="./img/avatar1.jpg" alt="" />
                            <div className="box">
                                <div className="name-time-disc">
                                    <span>Sarah Osman</span>
                                    <p>3 days ago</p>
                                </div>
                                <div className="disc-box">
                                    <p>
                                        Omer Saeed is right. be prepared to talk
                                        about your experience with different
                                        frameworks and languages. for projects,
                                        thet usually give you a small task to
                                        complete during the Internship
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="reply-box">
                            <img src="./img/avatar1.jpg" alt="" />
                            <div className="box">
                                <div className="name-time-disc">
                                    <span>Ahmed Salah</span>
                                    <p>22 hours ago</p>
                                </div>
                                <div className="disc-box">
                                    <p>
                                        i'm starting my Internship there net
                                        month, from what i've heard you'll
                                        likely be working on improving their
                                        internal tools and maybe some front-end
                                        enhancements for their customer portal.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="add-reply-box">
                    <h5>Reply</h5>
                    <textarea placeholder="Write your reply ..."></textarea>
                    <button>Post</button>
                </div>
            </div>
        </div>
    );
}
