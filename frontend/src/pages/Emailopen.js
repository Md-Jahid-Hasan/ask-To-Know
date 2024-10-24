import React, {Fragment, useState} from "react";

import Header from '../components/Header';

export function EmailOpen() {
    const [emailList, setEmailList] = useState([{id: 1, email: ""}, {id: 2, email: ""}, {id: 3, email: ""}])
    return (
        <Fragment>
            <Header/>

            <div className="main-content right-chat-active">
                <div className="middle-sidebar-bottom">
                    <div className="middle-sidebar-left pe-0 ps-lg-3 ms-0 me-0" style={{maxWidth: `100%`}}>
                        <div className="row">
                            <div className="col-lg-12">
                                <div
                                    className="chat-wrapper p-0 w-100 position-relative scroll-bar bg-white theme-dark-bg">
                                    <div className="chat-wrapper pt-0 w-100 position-relative scroll-bar">
                                        <div className="chat-body p-lg-4 p-3 mt-lg-3 mt-0">
                                            <div
                                                className="card dark-bg-transparent border-0 w-100 p-0 mb-3 shadow-none">
                                                <div className="card-body p-0">
                                                    <h6 className="fw-600 text-grey-500 font-xsssss">Today, 16th
                                                        September 2020, 11:45 </h6>
                                                    <h2 className="font-sm text-grey-900 fw-600">Meeting World</h2>
                                                </div>
                                            </div>

                                            <div className="accordion accodion-style--1 accordion"
                                                 id="accordionExample">

                                                {emailList.map((value, index) => (
                                                    <div
                                                        className="accordion-item shadow-none mb-0 p-0 bg-transparent">
                                                        <h2 className="accordion-header card-header ps-0 pt-0 pb-2 pe-0
                                                                        bg-transparent">
                                                            <button className="accordion-button d-flex"
                                                                    data-bs-toggle="collapse"
                                                                    data-bs-target={`#${value.id}`}
                                                                    aria-expanded="true"
                                                                    aria-controls={value.id}>
                                                                <figure className="avatar me-2 mb-0 w35 mt-1 pt-1">
                                                                    <img src={"assets/images/user.png"} alt="avater"
                                                                         className="float-right shadow-sm rounded-circle w-100"/>
                                                                </figure>
                                                                <span
                                                                    className="font-xssss text-grey-700 pt-2 mt-1 ps-2 fw-700 mb-0 me-auto text-dark">Aenni Mirenda </span>
                                                                <span
                                                                    className="font-xssss text-grey-500 pt-2 mt-1 ps-2 fw-600 mb-0 ms-auto">14.09.2020 12:23</span>
                                                            </button>
                                                        </h2>
                                                        <div
                                                            className="accordion-collapse collapse card-body p-0"
                                                            id={value.id}>
                                                            <div className="accordion-body">
                                                                <p className="text-grey-600 mb-4 font-xsss lh-28 fw-500 mt-3 text-dark">Hi
                                                                    Aenni, <br/> <br/> All individual Framer
                                                                    subscriptions
                                                                    have been grandfathered into a Pro plan at your
                                                                    existing
                                                                    rate. If you were on a Small Team plan, then all
                                                                    5 seats
                                                                    have been converted over to Pro seats at your
                                                                    existing
                                                                    rate. <br/><br/> Regards,<br/>Jessica </p>
                                                                <textarea
                                                                    className="form-control mb-5 p-3 h100 bg-greylight lh-16"
                                                                    rows="5"
                                                                    placeholder="Write your message..."></textarea>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}

                                            </div>
                                        </div>
                                    </div>

                                    {/*Download button and file show if needed*/}
                                    {/*<button className="btn btn-success btn-lg me-2">*/}
                                    {/*    <i className="bi feather-file me-1"></i> Download File*/}
                                    {/*</button>*/}
                                    {/*<div*/}
                                    {/*    className="chat-bottom dark-bg p-3 mb-3 border-top border-bottom bor-0 theme-dark-bg"*/}
                                    {/*    style={{width: '98%'}}>*/}
                                    {/*    <button className="btn btn-success btn-sm m-2">*/}
                                    {/*        <i className="bi feather-file me-1"></i> file.jpg*/}
                                    {/*    </button>*/}
                                    {/*    <button className="btn btn-success btn-sm m-2">*/}
                                    {/*        <i className="bi feather-file me-1"></i> file.jpg*/}
                                    {/*    </button>*/}

                                    {/*</div>*/}

                                    <div
                                        className="chat-bottom dark-bg p-3 mb-3 border-top border-bottom bor-0 theme-dark-bg"
                                        style={{width: '98%'}}>
                                        <form className="chat-form d-block overflow-hidden">
                                            <button
                                                className="bg-dark border-0 btn-round-md float-left d-lg-block d-none">
                                                <i className="ti-microphone text-white lh-4 font-xs"></i></button>
                                            <button className="bg-dark border-0 btn-round-md ms-1 float-left"><i
                                                className="ti-clip text-white lh-4 font-xs"></i></button>
                                            <button className="bg-dark border-0 btn-round-md ms-1 float-left"><i
                                                className="ti-image text-white lh-4 font-xs"></i></button>
                                            <button
                                                className="bg-current border-0 p-0 float-right w200 text-white fw-600 font-xssss text-uppercase">Send
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </Fragment>
    );
}