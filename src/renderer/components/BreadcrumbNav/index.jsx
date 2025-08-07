import React from 'react';
import { Breadcrumb } from 'antd';
import { Link, withRouter } from 'react-router-dom';
import './index.css';

const BreadcrumbNav = ({ location }) => {
    // 定义完整的路由层级映射关系（包含首页）
    const routeHierarchy = {
        '/': '仪表盘', // 添加首页映射
        '/meituan': {
            name: '美团数据',
            children: {
                '/meituan/spuList': '商品列表'
            }
        },
        '/eleme': {
            name: '饿了么数据',
            children: {
                '/eleme/spuList': '商品列表'
            }
        },
        '/settings': {
            name: '系统设置',
            children: {}
        }
    };

    // 获取当前路径的所有层级
    const getCurrentPathLevels = () => {
        if (location.pathname === '/') return ['/']; // 特殊处理首页

        const pathSnippets = location.pathname.split('/').filter(i => i);
        let levels = [];
        let currentPath = '';

        pathSnippets.forEach(snippet => {
            currentPath += `/${snippet}`;
            // 跳过纯数字参数
            if (!/^\d+$/.test(snippet)) {
                levels.push(currentPath);
            }
        });

        return levels;
    };

    // 获取面包屑项
    const getBreadcrumbItems = () => {
        const currentLevels = getCurrentPathLevels();
        let items = [];
        let currentHierarchy = routeHierarchy;

        currentLevels.forEach((levelPath, index) => {
            const isLast = index === currentLevels.length - 1;
            const routeName = typeof currentHierarchy[levelPath] === 'string'
                ? currentHierarchy[levelPath]
                : currentHierarchy[levelPath]?.name;

            if (routeName) {
                items.push(
                    <Breadcrumb.Item key={levelPath}>
                        {isLast ? (
                            <span>{routeName}</span>
                        ) : (
                            <Link to={levelPath}>{routeName}</Link>
                        )}
                    </Breadcrumb.Item>
                );

                // 进入下一层级
                if (currentHierarchy[levelPath]?.children) {
                    currentHierarchy = currentHierarchy[levelPath].children;
                }
            }
        });

        return items;
    };

    return (
        <Breadcrumb style={{ margin: '16px 0' }}>
            {getBreadcrumbItems()}
        </Breadcrumb>
    );
};

export default withRouter(BreadcrumbNav);
