// components/InputGroup.js
import { useState } from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';

const Input = ({ placeholder, children, type, value, onChange, name, ...rest }) => {
  const [senhaVisivel, setSenhaVisivel] = useState(false);

  const toggleSenha = () => {
    setSenhaVisivel(!senhaVisivel);
  };

  // Define o tipo do input considerando o toggle para password
  const inputType = type === 'password' && !senhaVisivel ? 'password' : 'text';

  return (
    <div className="input-group">
      <input
        type={inputType}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        name={name}
        {...rest}
      />
      {type === 'password' && (
        <button
          type="button"
          className="toggle-password"
          onClick={toggleSenha}
          aria-label={senhaVisivel ? "Esconder senha" : "Mostrar senha"}
        >
          <Icon icon={senhaVisivel ? 'mdi-light:eye-off' : 'mdi-light:eye'} width="24" />
        </button>
      )}
      {children}
    </div>
  );
};

Input.propTypes = {
  placeholder: PropTypes.string.isRequired,
  children: PropTypes.node,
  type: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  name: PropTypes.string,
};

Input.defaultProps = {
  type: 'email',
  value: '',
  onChange: () => {},
  name: '',
};

export default Input;
