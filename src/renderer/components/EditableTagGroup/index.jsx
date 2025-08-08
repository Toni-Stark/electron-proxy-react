import React from 'react';

import Tag from 'antd/lib/tag'

import 'antd/lib/tag/style/index.css';
import './index.css'

export default class EditableTagGroup extends React.Component {
    constructor(props) {
        super(props);
        this.handleClose = this.handleClose.bind(this)
    }

    handleClose = (tag) => {
        this.props.updateLinks({type: 'del', key: tag.key, name:tag.title, hash: tag.hash});
    };
    handleChange = (tag) => {
        this.props.updateLinks({type: 'add', key: tag.key, name:tag.title, hash: tag.hash});
    };


    render() {
        const { links, active } = this.props;
        return (
            <div className="tags_style">
                {links.map((tag, index) => (
                        <Tag
                            className={active === index ? "tag_style active": "tag_style"}
                            key={tag.title + tag.hash + index}
                            closable={index !== 0}
                            onClick={() => this.handleChange(tag)}
                            onClose={() => this.handleClose(tag)}>
                            {tag.title}
                        </Tag>
                    )
                )}
            </div>
        );
    }
}
