import React from 'react';
import { useField } from 'formik';
import { Input, Icon } from 'antd';

import { StyledFormItem } from './Form.styles';

type FieldProps = {
	name: string;
	label: string;
	icon?: string;
};

export const FormInput: React.FC<FieldProps> = ({ icon, label, name }) => {
	const [{ value, onChange }, { touched, error }] = useField(name);
	const errorMessage = touched && error;
	const status = errorMessage ? 'error' : '';
	const getValue = () => {
		if (typeof value === 'string') {
			return value;
		}
		if (typeof value === 'number') {
			return String(value);
		}
		return '';
	};
	return (
		<StyledFormItem validateStatus={status} help={errorMessage}>
			<Input
				prefix={icon && <Icon type={icon} />}
				placeholder={label}
				name={name}
				onChange={onChange}
				value={getValue()}
			/>
		</StyledFormItem>
	);
};