import React, { useState } from 'react';
import {
  Row,
  Col,
  Table,
  Form,
  Button,
} from '@themesberg/react-bootstrap';
import { statusOptions, tableHeaders, typeOptions } from './constants';
import useExportCenterListing from './hooks/useExportCenterListing';
import {
  faDownload,
  faArrowCircleDown,
  faArrowCircleUp,
  faRefresh,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  getDateTimeinSeconds,
} from '../../utils/dateFormatter';
import PaginationComponent from '../../components/Pagination';
import { InlineLoader } from '../../components/Preloader';
import Datetime from 'react-datetime';
import { capitalizeFirstLetter } from '../../utils/helper';
import './exportCenter.scss';
import Trigger from '../../components/OverlayTrigger';
import { saveAs } from 'file-saver';

const ExportCenter = () => {
  const {
    t,
    setOrderBy,
    setSortBy,
    setStatusFilter,
    exportCenterList,
    setPage,
    setType,
    type,
    statusFilter,
    limit,
    setLimit,
    page,
    totalPages,
    selected,
    sortBy,
    over,
    setOver,
    orderBy,
    loading,
    refetch,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    handleReset,
  } = useExportCenterListing();

  // const [downloadProgress, setDownloadProgress] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const handlePlayerTableSorting = (param) => {
    if (param.value === orderBy) {
      setSortBy(sortBy === 'asc' ? 'desc' : 'asc');
    } else {
      setOrderBy(param.value);
      setSortBy('asc');
    }
  };
  const handleRefresh = () => {
    refetch();
  };

  const downloadAsZip = async (id, zipName, csvUrls) => {
    setIsLoading(true)
    // setDownloadProgress((prev) => ({ ...prev, [id]: true }));

    try {
      zipName === 'casino_transactions_csv_download' ? saveAs(csvUrls, `${zipName}.zip`) : saveAs(csvUrls, `${zipName}.csv`)
      setIsLoading(false)
      // setDownloadProgress((prev) => ({ ...prev, [id]: false }));
    } catch (error) {
      setIsLoading(false)
      // setDownloadProgress((prev) => ({ ...prev, [id]: false }));
      throw new Error(`Failed to fetch url`);
    }
  };

  return (
    <>
      <Row>
        <Col>
          <h3>{t('title')}</h3>
        </Col>
      </Row>
      <Row className='g-3 align-items-center'>
        <Col xs={12} sm={6} md={3}>
          <Form.Label>{t('filter.type')}</Form.Label>
          <Form.Select
            onChange={(e) => {
              setPage(1);
              setType(e.target.value);
            }}
            value={type}
          >
            {typeOptions.map((type, _idx) => (
              <option key={type.label} value={type.value}>
                {type.label}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col xs={12} sm={6} md={3}>
          <Form.Label>{t('filter.status')}</Form.Label>

          <Form.Select
            onChange={(e) => {
              setPage(1);
              setStatusFilter(e.target.value);
            }}
            value={statusFilter}
          >
            {statusOptions.map((status, _idx) => (
              <option key={status.label} value={status.value}>
                {status.label}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col xs={12} sm={6} md={3}>
          <Form.Label>{t('filter.startDate')}</Form.Label>
          <Datetime
            value={startDate}
            onChange={(date) => setStartDate(date)}
            timeFormat={false}
            className='w-100'
            inputProps={{readOnly:true}}
          />
        </Col>
        <Col xs={12} sm={6} md={3}>
          <Form.Label>{t('filter.endDate')}</Form.Label>
          <Datetime
            value={endDate}
            timeFormat={false}
            onChange={(date) => setEndDate(date)}
            className='w-100'
            inputProps={{readOnly:true}}
          />
        </Col>
        <Col xs={12} className='text-end'>
          <Button onClick={handleReset} variant='success' className='mt-4 me-4'>
            Reset
          </Button>

          <Trigger message='Refresh' id={`refresh`} />
          <Button
            onClick={handleRefresh}
            variant='success'
            className='mt-4'
            id={`refresh`}
          >
            <FontAwesomeIcon icon={faRefresh} />
          </Button>
        </Col>
      </Row>
      <Table
        bordered
        striped
        responsive
        hover
        size='sm'
        className='text-center mt-4'
      >
        <thead className='thead-dark'>
          <tr>
            {tableHeaders.map((h, idx) => (
              <th
                key={idx}
                onClick={() => h.value !== '' && handlePlayerTableSorting(h)}
                style={{
                  cursor: (h.value !== '' && 'pointer'),
                }}
                className={selected(h) ? 'border-3 border border-blue' : ''}
              >
                {t(h.labelKey)}{' '}
                {selected(h) &&
                  (sortBy === 'asc' ? (
                    <FontAwesomeIcon
                      style={over ? { color: 'red' } : {}}
                      icon={faArrowCircleUp}
                      onClick={() => setSortBy('desc')}
                      onMouseOver={() => setOver(true)}
                      onMouseLeave={() => setOver(false)}
                    />
                  ) : (
                    <FontAwesomeIcon
                      style={over ? { color: 'red' } : {}}
                      icon={faArrowCircleDown}
                      onClick={() => setSortBy('asc')}
                      onMouseOver={() => setOver(true)}
                      onMouseLeave={() => setOver(false)}
                    />
                  ))}
              </th>
            ))}
          </tr>
        </thead>
        {loading ? (
          <tr>
            <td colSpan={10} className='text-center'>
              <InlineLoader />
            </td>
          </tr>
        ) : (
          <tbody>
            {exportCenterList?.rows?.map((exportData) => {
              const {
                id,
                type,
                status,
                url,
                // urlsArray,
                // childExports,
                // createdAt,
                updatedAt,
              } = exportData;

              return (
                <tr
                  key={id}
                  className='text-center m-1'
                  style={{
                    height: '40px',
                    verticalAlign: 'middle',
                  }}
                >
                  <td>{id}</td>
                  <td>{type}</td>
                  <td>{getDateTimeinSeconds(updatedAt)}</td>
                  <td>
                    <span className={`status ${status}`}>
                      {capitalizeFirstLetter(status)}
                    </span>
                  </td>
                  <td>
                    {isLoading ? (
                      <InlineLoader />
                    ) : (
                      <>
                        {' '}
                        <Trigger
                          message={type === 'casino_transactions_csv_download' ? 'Download CSV in Zip' : 'Download CSV'}
                          id={`csv-${id}`}
                        />
                        <Button
                          id={`csv-${id}`}
                          className='m-1'
                          size='sm'
                          variant='warning'
                          disabled={status !== 'completed'}
                          onClick={() => downloadAsZip(id, type, url)}
                        >
                          {/* <a href={url}> */}
                          <FontAwesomeIcon icon={faDownload} />
                          {/* </a>   */}
                        </Button>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}

            {exportCenterList?.count === 0 && (
              <tr>
                <td colSpan={6} className='text-danger text-center'>
                  {t('noDataFound')}
                </td>
              </tr>
            )}
          </tbody>
        )}
      </Table>

      {exportCenterList?.rows?.length !== 0 && (
        <PaginationComponent
          page={exportCenterList?.count < page ? setPage(1) : page}
          totalPages={totalPages}
          setPage={setPage}
          limit={limit}
          setLimit={setLimit}
        />
      )}
    </>
  );
};

export default ExportCenter;
