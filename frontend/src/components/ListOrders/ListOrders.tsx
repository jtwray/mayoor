/* eslint-disable  @typescript-eslint/camelcase */
import React from 'react';
import { useTranslation } from 'react-i18next';
import { RightCircleOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useQuery } from 'react-apollo';
import { TFunction } from 'i18next';
import { ColumnProps } from 'antd/lib/table';
import { Link } from 'react-router-dom';

import {
	GetAllOrders,
	GetAllOrdersVariables,
	GetAllOrders_getAllOrders_items,
} from '../../__generated__/types';
import { PageTitle } from '../MainWrapper/MainWrapper.styles';
import { PaginatedTable } from '../PaginatedTable/PaginatedTable';

import { GET_ALL_ORDERS_QUERY } from './queries';

const PAGE_SIZE = 10;

const getColumns = (t: TFunction): ColumnProps<GetAllOrders_getAllOrders_items>[] => [
	{
		title: t('Order number'),
		dataIndex: 'number',
		render: (_, record) => {
			return <Link to={`/orders/${record.id}`}>{record.number}</Link>;
		},
	},
	{
		title: t('Customer name'),
		width: 150,
		ellipsis: true,
		dataIndex: 'customer.name',
		render: (_, { customer }) =>
			customer && <Link to={`/customers/${customer.id}`}>{customer.name}</Link>,
	},
	{
		title: t('Items info'),
		width: 250,
		ellipsis: true,
		dataIndex: 'items',
		render: (_, { items }) => JSON.stringify(items),
	},
	{
		title: t('Created at'),
		width: 150,
		ellipsis: true,
		dataIndex: 'createdAt',
	},
	{
		key: 'actions',
		width: 50,
		render: (_, record) => {
			return (
				<Link to={`/orders/${record.id}`}>
					<Button icon={<RightCircleOutlined />} type="link"></Button>
				</Link>
			);
		},
	},
];

export const ListOrders: React.FC = () => {
	const { t } = useTranslation();

	const { data, loading, fetchMore } = useQuery<GetAllOrders, GetAllOrdersVariables>(
		GET_ALL_ORDERS_QUERY,
		{
			variables: { first: PAGE_SIZE },
			fetchPolicy: 'network-only',
		},
	);

	const paginationChangedHandler = (newPageNumber: number) => {
		fetchMore({
			variables: { first: PAGE_SIZE, skip: (newPageNumber - 1) * PAGE_SIZE },
			updateQuery: (_, { fetchMoreResult }) => {
				if (!fetchMoreResult) {
					throw new Error('Failed to load more');
				}
				return fetchMoreResult;
			},
		});
	};

	const items = data?.getAllOrders.items ?? [];

	return (
		<>
			<PageTitle>{t('List orders')}</PageTitle>
			<PaginatedTable<GetAllOrders_getAllOrders_items>
				columns={getColumns(t)}
				records={items}
				totalCount={data?.getAllOrders.totalCount ?? 0}
				onPaginationChange={paginationChangedHandler}
				loading={loading}
				translations={{
					emptyResult: t('Customers list is empty'),
					search: t('Search customers'),
				}}
			/>
		</>
	);
};