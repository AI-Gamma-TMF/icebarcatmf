import styled from 'styled-components';

export const NoTabDataContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100px;
    border: 1px solid #eee;
    margin-bottom: 10px;
    font-size: 18px;
    font-weight: 600;
`

export const EditInfoContainer = styled.div``
export const SimpleEditFormContainer = styled.div`
    .simple-text-head {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin-top: 14px;
        h6 {
            color: #308dde;
            font-size: 22px;
            margin-bottom: 0px;
        }
    }
    .edit-btn-wrap {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 22px;
    }
  .fab-icon-wrap {
    display: flex;
    align-items: center;
    margin-top: 15px;
    .fab-icon {
      margin-left: 10px;
      svg {
        cursor: pointer;
      }
    }
  }
`

export const PlayerTabContainer = styled.div`
  .player-tab-wrap {
    padding: 0px 20px;
  }
  .edit-inner-tabwrap {
    width: 200px;
  }
  .buttonDiv {
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.ticket-div {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
`

export const EditPlayerFieldContainer = styled.div`
  padding-left: 20px;
  padding-right: 20px;
  margin-top: 30px;
  padding-top: 20px;
  padding-bottom: 20px;
  margin-bottom: 20px;
  .edit-field-playerbtn {
    display: flex;
    align-items: center;
    .btn {
      width: 200px;
      margin-right: 10px;
    }
  }
`

export const OverviewContainer = styled.div`
  .basic-wrap-add {
    width: 200px
  }
`
