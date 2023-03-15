import { useAppSelector } from '@/store/hooks';
import { usersSelector } from '@/store/user/userSlice';
import { Col, DatePicker, Row, Select, Space, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
const { RangePicker } = DatePicker;

const { Title, Text } = Typography;

export interface IFilter {
  status: 1 | 2 | undefined;
  owners: string[];
  creators: string[];
  sort: 'sort' | '-deadTime' | 'deadTime' | 'createdAt' | '-createdAt' | '-updatedAt' | 'updatedAt' | 'finishTime' | '-finishTime' | string;

}
export default function HomeFilter(props: {
  filter: IFilter;
  filterChange: (filter: IFilter) => void;
}) {

  const users = useAppSelector(usersSelector)

  const usersOpts = users?.map(user => ({
    value: user.id,
    label: user.username
  }));

  const usersOption = [{ value: '', label: '全部' }].concat(usersOpts || [])

  const [filter, setFilter] = useState<{
    status: 1 | 2 | undefined;
    owners: string[];
    creators: string[];
    sort: string;
  }>(props.filter);

  useEffect(() => {
    props.filterChange(filter)
  }, [filter])

  return (
    <Row>
      <Col span={24}>
        <Space wrap size={'large'} style={{ float: 'right', marginBottom: 20 }}>
          <div>
            <Text>任务状态: </Text>
            <Select
              value={filter.status}
              placeholder="任务状态"
              defaultValue={1}
              // onChange={handleChange}
              options={[
                { value: 1, label: '未完成' },
                { value: 2, label: '已完成' },
                { value: undefined, label: '全部任务' },
              ]}
            />

          </div>
          <div>
            <Text>负责人: </Text>
            <Select
              mode="multiple"
              value={filter.owners}
              style={{ minWidth: 100 }}
              placeholder="筛选"
              options={usersOption}
              onChange={(values: string[]) => setFilter({ ...filter, ...{ owners: values } })}
            />
          </div>
          <div>
            <Text>创建人: </Text>
            <Select
              mode="multiple"
              style={{ minWidth: 100 }}
              placeholder="创建人"
              value={filter.creators}
              options={usersOption}
              onChange={(values: string[]) => setFilter({ ...filter, ...{ creators: values } })}

            />
          </div>
          <div>
            <Text>截止时间: </Text>
            <RangePicker />
            {/* <Select
              placeholder="筛选"
              defaultValue={1}
              // onChange={handleChange}
              options={[
                { value: 1, label: '未完成' },
                { value: 2, label: '已完成' },
                { value: null, label: '全部todo' },
              ]}
            /> */}
          </div>
          <div>
            <Text>完成时间: </Text>
            <RangePicker />
            {/* <Select
              placeholder="筛选"
              defaultValue={1}
              // onChange={handleChange}
              options={[
                { value: 1, label: '未完成' },
                { value: 2, label: '已完成' },
                { value: null, label: '全部todo' },
              ]}
            /> */}
          </div>
          <div>
            <Text>排序: </Text>
            <Select
              value={filter.sort}
              style={{ minWidth: 120 }}
              onChange={(value: string) => setFilter({ ...filter, ...{ sort: value } })}
              placeholder="排序"
              defaultValue={'-deadTime'}
              // onChange={handleChange}
              dropdownMatchSelectWidth={false}
              options={

                [
                  {
                    label: '拖拽排序',
                    value: 'order'
                  },
                  {
                    label: '截止时间',
                    options: [
                      { label: '截止时间升序', value: 'deadTime' },
                      { label: '截止时间逆序', value: '-deadTime' },
                    ],
                  },
                  {
                    label: '创建时间',
                    options: [
                      { label: '创建时间升序', value: 'createdAt' },
                      { label: '创建时间逆序', value: '-createdAt' },
                    ],
                  },
                  {
                    label: '更新时间',
                    options: [
                      { label: '更新时间升序', value: 'updatedAt' },
                      { label: '更新时间逆序', value: '-updatedAt' },
                    ],
                  },
                  {
                    label: '完成时间',
                    options: [
                      { label: '完成时间升序', value: 'finishTime' },
                      { label: '完成时间逆序', value: '-finishTime' },
                    ],
                  },
                ]}
            />
          </div>
        </Space>
      </Col>
    </Row>
  )
} 