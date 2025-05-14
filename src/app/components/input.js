// components/InputGroup.js
import { useState } from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react'; // Supondo que você esteja usando iconify para ícones

const InputGroup = ({ placeholder, children, type }) => {
  const [senhaVisivel, setSenhaVisivel] = useState(false);

  const toggleSenha = () => {
    setSenhaVisivel(!senhaVisivel);
  };

  return (
    <div className="input-group">
      <input
        type={type === 'password' && !senhaVisivel ? 'password' : 'text'}
        placeholder={placeholder}
      />
      {type === 'password' && (
        <button type="button" className="toggle-password" onClick={toggleSenha}>
          <span id="icone-senha">
            <Icon icon={senhaVisivel ? 'mdi-light:eye-off' : 'mdi-light:eye'} width="24" />
          </span>
        </button>
      )}
      {children}
    </div>
  );
};

InputGroup.propTypes = {
  placeholder: PropTypes.string.isRequired,
  children: PropTypes.node,
  type: PropTypes.string, // Pode ser 'email', 'text', 'password', etc.
};

InputGroup.defaultProps = {
  type: 'email', // Tipo padrão do input
};

export default InputGroup;
