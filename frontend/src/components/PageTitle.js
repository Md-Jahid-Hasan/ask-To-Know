import React,{Component} from 'react';

class PageTitle extends Component {
    render() {
        const {title, create_button} = this.props;
        return (
            <div className="card shadow-xss w-100 d-block d-flex border-0 p-4 mb-3">
                <h2 className="fw-700 mb-0 mt-0 font-md text-grey-900 d-flex align-items-center">{title}
                    <form action="#" className="pt-0 pb-0 ms-auto">
                        <div className="search-form-2 ms-2">
                            <i className="ti-search font-xss"></i>
                            <input type="text"
                                   className="form-control text-grey-500 mb-0 bg-greylight theme-dark-bg border-0"
                                   placeholder="Search here."/>
                        </div>
                    </form>
                    {create_button && <a href="/" className="btn ms-2 bg-greylight rounded-3" style={{padding: ".55rem"}}>Create</a>}
                    <a href="/" className="btn-round-md ms-2 bg-greylight theme-dark-bg rounded-3"><i
                        className="feather-filter font-xss text-grey-500"></i></a>
                </h2>
            </div>
        );
    }
}

export default PageTitle;


