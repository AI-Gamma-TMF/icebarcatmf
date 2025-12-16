import { faWindowClose } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { toast as hotToast} from 'react-hot-toast'
import { v4 as uuid } from 'uuid';

export const toast = (message, type, id = uuid()) => {
  switch (type) {
    case 'success':
      return hotToast.success(<div>
        {message}
        <FontAwesomeIcon onClick={() => hotToast.dismiss(id)} style={{position: 'absolute', top: '3px', right: '5px', cursor: 'pointer'}} icon={faWindowClose} />
      </div>, {
        id: id,
      })

    case 'error':
      return hotToast.error(<div>
        {message}
        <FontAwesomeIcon onClick={() => hotToast.dismiss(id)} style={{position: 'absolute', top: '3px', right: '5px', cursor: 'pointer'}} icon={faWindowClose} />
      </div>, {
        id: id
      })
  }
}