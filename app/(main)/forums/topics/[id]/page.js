import React from "react";

const data = {
    id: 2,
    title: "Discussion about Full-Stack Development Internship",
    content: `Hey everyone, I'm really interested in the Full-Stack
            Developer Internshipat Zain Sudan. Has anyone applied or
            have any insights about the interview process or what
            kind of projects interns usually work on?`,
    authorId: "66838a71b3e4f5a6b7c8d9e2",
    authorName: "Mozan",
    replies: 5,
    dateTime: "2025-05-10 01:18:23",
};

export default function page() {
    return (
        <div className="content">
            <div className="head-disc">
                <div className="title">
                    <h3>{data.title}</h3>
                    <span>
                        Author:{" "}
                        <a href={`/users/${data.authorId}`}>
                            {data.authorName}
                        </a>
                        <i className="icon-dot"></i>
                        <span>
                            <time dateTime="date">{data.dateTime}</time>
                        </span>
                    </span>
                </div>
                <div className="disc-box">
                    <p>{data.content}</p>
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
                                    <span>Rasha Salah</span>
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
                                    <span>Alaa Yahia</span>
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
                                    <span>Mozan</span>
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
