import React, {Component} from 'react';

const groupList = [
    {
        imageUrl: 'story.png',
        name: 'Studio Express',
        friend: '12',
    },
    {
        imageUrl: 'story.png',
        name: 'Armany Design',
        friend: '18',
    },
]

class Group extends Component {
    render() {
        return (
            <div className="card w-100 shadow-xss rounded-xxl border-0 mb-3">
                <div className="card-body d-flex align-items-center p-4">
                    <h4 className="fw-700 mb-0 font-xssss text-grey-900">Suggest Pages</h4>
                    <a href="/defaultmember" className="fw-600 ms-auto font-xssss text-primary">See all</a>
                </div>
                {groupList.map((value, index) => (
                    <div className="wrap" key={index}>
                        <div className="card-body d-flex pt-0 ps-4 pe-4 pb-0 overflow-hidden  bor-0">
                            <img src={`assets/images/${value.imageUrl}`} alt="group"
                                 className="img-fluid rounded-xxl mb-2"/>
                        </div>
                    </div>

                ))}


            </div>
        );
    }
}

export default Group;