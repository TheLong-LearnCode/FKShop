import React from 'react';
import { Tabs, Badge } from 'antd';

const { TabPane } = Tabs;

const OrderTabs = ({ activeTab, tabCounts, onTabChange }) => {
  console.log("tabCounts received in OrderTabs:", tabCounts);
  
  return (
    <Tabs activeKey={activeTab} onChange={onTabChange} className="custom-tabs">
      <TabPane tab={<Badge count={tabCounts.all} offset={[10, 0]}><span>All</span></Badge>} key="all" />
      <TabPane tab={<Badge count={tabCounts.pending} offset={[10, 0]}><span>Pending</span></Badge>} key="pending" />
      <TabPane tab={<Badge count={tabCounts.processing} offset={[10, 0]}><span>Processing</span></Badge>} key="in-progress" />
      <TabPane tab={<Badge count={tabCounts.delivering} offset={[10, 0]}><span>Delivering</span></Badge>} key="delivering" />
      <TabPane tab={<Badge count={tabCounts.delivered} offset={[10, 0]}><span>Delivered</span></Badge>} key="delivered" />
      <TabPane tab={<Badge count={tabCounts.cancel} offset={[10, 0]}><span>Cancel</span></Badge>} key="cancel" />
      <TabPane />
    </Tabs>
  );
};

export default OrderTabs;
