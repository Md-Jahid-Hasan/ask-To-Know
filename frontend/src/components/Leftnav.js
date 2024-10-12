import React, {useState} from 'react';

const SidebarItem = ({icon: Icon, text, submenu}) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative group" onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
            <div className="flex items-center p-2 hover:bg-gray-100 cursor-pointer rounded-lg">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${getColor(text)}`}>
                    <i className={`${Icon} btn-round-md bg-blue-gradiant me-3`}></i>
                </div>
                <span className="ml-3 text-sm font-medium">{text}</span>
            </div>
            {submenu && isOpen && (
                <div className="absolute left-full top-0 ml-2 w-48 bg-white shadow-lg rounded-lg overflow-hidden">
                    {submenu.map((item, index) => (
                        <div key={index} className="p-2 hover:bg-gray-100 cursor-pointer">
                            {item}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const Sidebar = () => {
    const items = [
        {icon: "feather-tv", text: 'Newsfeed', submenu: ['Latest News', 'Trending']},
        {icon: "feather-award", text: 'Badges', submenu: ['My Badges', 'Leaderboard']},
        {icon: "feather-globe", text: 'Explore Stories', submenu: ['Featured', 'Most Viewed']},
        {icon: "feather-zap", text: 'Popular Groups', submenu: ['Join Group', 'Create Group']},
        {icon: "feather-user", text: 'Author Profile', submenu: ['Edit Profile', 'Settings']},
    ];

    return (
        <nav className={`navigation scroll-bar nav-active`}>
            <div className="container ps-0 pe-0">
                <div className="nav-content">
                    {items.map((item, index) => (
                        <SidebarItem key={index} icon={item.icon} text={item.text} submenu={item.submenu}/>
                    ))}
                </div>
            </div>
        </nav>
    );
};

const getColor = (text) => {
    const colors = {
        'Newsfeed': 'bg-blue-500',
        'Badges': 'bg-orange-500',
        'Explore Stories': 'bg-yellow-500',
        'Popular Groups': 'bg-pink-500',
        'Author Profile': 'bg-blue-600',
    };
    return colors[text] || 'bg-gray-500';
};

export default Sidebar;