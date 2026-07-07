import React, { useState, useRef, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { Container, Row, Col, Card, Button, Form, Alert, Spinner, Badge, Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export const CertificateGenerator = () => {
  const [templateImage, setTemplateImage] = useState(null);
  const [templatePreview, setTemplatePreview] = useState(null);
  const [excelData, setExcelData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [generatedCertificates, setGeneratedCertificates] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [fieldPositions, setFieldPositions] = useState({});
  const [imageScale, setImageScale] = useState({ scaleX: 1, scaleY: 1 });
  const [placedFields, setPlacedFields] = useState([]);
  const [selectedField, setSelectedField] = useState(null);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showPreview, setShowPreview] = useState(false);
  const [fileNameHeaders, setFileNameHeaders] = useState([]);
  const [selectedHeaders, setSelectedHeaders] = useState([]);
  const [showHeaderSelection, setShowHeaderSelection] = useState(false);
  
  const imageRef = useRef(null);
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  // Handle template image upload
  const handleTemplateUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          setTemplateImage(img);
          setTemplatePreview(event.target.result);
          setImageDimensions({ width: img.width, height: img.height });
          setSuccess('Template image loaded successfully!');
          setError('');
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Excel file upload
  const handleExcelUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = new Uint8Array(event.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(firstSheet);
          
          if (jsonData.length > 0) {
            const headersList = Object.keys(jsonData[0]);
            setHeaders(headersList);
            setExcelData(jsonData);
            setFileNameHeaders(headersList);
            setSelectedHeaders(headersList.slice(0, 3)); // Default select first 3 headers
            
            // Initialize field positions for all headers with default values
            const initialPositions = {};
            headersList.forEach((header, index) => {
              initialPositions[header] = { 
                x: 100 + (index * 50), 
                y: 150 + (index * 40) 
              };
            });
            setFieldPositions(initialPositions);
            setPlacedFields(headersList);
            
            setSuccess(`Excel loaded! Found ${jsonData.length} records with ${headersList.length} columns`);
            setError('');
            setShowHeaderSelection(true);
          } else {
            setError('No data found in Excel file');
          }
        } catch (err) {
          setError('Error reading Excel file: ' + err.message);
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  // Update field position
  const updateFieldPosition = (header, field, value) => {
    const numValue = parseInt(value) || 0;
    setFieldPositions(prev => ({
      ...prev,
      [header]: {
        ...prev[header],
        [field]: numValue
      }
    }));
  };

  // Update image scale on load
  const handleImageLoad = () => {
    if (imageRef.current && templateImage) {
      const rect = imageRef.current.getBoundingClientRect();
      setImageScale({
        scaleX: templateImage.width / rect.width,
        scaleY: templateImage.height / rect.height
      });
    }
  };

  // Handle mouse move on image for preview
  const handleMouseMove = (e) => {
    if (!templateImage) return;
    const rect = e.target.getBoundingClientRect();
    const x = (e.clientX - rect.left) * imageScale.scaleX;
    const y = (e.clientY - rect.top) * imageScale.scaleY;
    setMousePosition({ x: Math.round(x), y: Math.round(y) });
  };

  // Toggle header selection for filename
  const toggleHeaderSelection = (header) => {
    setSelectedHeaders(prev => {
      if (prev.includes(header)) {
        return prev.filter(h => h !== header);
      } else {
        return [...prev, header];
      }
    });
  };

  // Generate filename from row data
  const generateFileName = (row) => {
    if (selectedHeaders.length === 0) {
      return 'certificate';
    }
    return selectedHeaders.map(header => {
      const value = row[header] || '';
      return value.toString().replace(/[^a-zA-Z0-9]/g, '_');
    }).join('_');
  };

  // Generate certificates with proper field placement
  const generateCertificates = async () => {
    if (!templateImage || excelData.length === 0) {
      setError('Please upload both template image and Excel file');
      return;
    }

    setIsProcessing(true);
    setError('');
    const certificates = [];

    try {
      for (let rowIndex = 0; rowIndex < excelData.length; rowIndex++) {
        const row = excelData[rowIndex];
        
        // Create canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Set canvas size to match image
        canvas.width = templateImage.width;
        canvas.height = templateImage.height;
        
        // Draw template image
        ctx.drawImage(templateImage, 0, 0);
        
        // Draw all fields at their positions (without underline)
        headers.forEach(header => {
          const value = row[header] || '';
          const pos = fieldPositions[header];
          
          if (pos && value) {
            // Configure text style
            let fontSize = Math.min(32, templateImage.width / 20);
            if (value.length > 20) fontSize = fontSize * 0.7;
            else if (value.length > 15) fontSize = fontSize * 0.85;
            
            ctx.font = `bold ${fontSize}px Arial`;
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            
            const textWidth = ctx.measureText(value).width;
            const padding = fontSize * 0.2;
            
            // White background
            ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
            ctx.fillRect(
              pos.x - padding, 
              pos.y - fontSize/2 - padding, 
              textWidth + padding * 2, 
              fontSize + padding * 2
            );
            
            // Text only - no underline
            ctx.fillStyle = '#000000';
            ctx.fillText(value, pos.x, pos.y);
          }
        });
        
        // Convert canvas to PNG
        const certificateUrl = canvas.toDataURL('image/png');
        
        // Generate filename
        const fileName = generateFileName(row);
        
        certificates.push({
          data: certificateUrl,
          row: row,
          index: rowIndex + 1,
          fileName: fileName
        });
      }
      
      setGeneratedCertificates(certificates);
      setSuccess(`Generated ${certificates.length} certificates successfully!`);
    } catch (err) {
      setError('Error generating certificates: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  // Download all certificates as ZIP
  const downloadAllAsZip = async () => {
    if (generatedCertificates.length === 0) {
      setError('No certificates to download');
      return;
    }

    setIsProcessing(true);
    try {
      const zip = new JSZip();
      
      // Add each certificate to zip
      generatedCertificates.forEach((cert) => {
        const base64Data = cert.data.split(',')[1];
        zip.file(`${cert.fileName}.png`, base64Data, { base64: true });
      });
      
      // Generate zip file
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      saveAs(zipBlob, `certificates_${new Date().getTime()}.zip`);
      
      setSuccess(`Downloaded ${generatedCertificates.length} certificates as ZIP!`);
    } catch (err) {
      setError('Error creating ZIP file: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  // Download single certificate
  const downloadCertificate = (certificateData, fileName, index) => {
    const link = document.createElement('a');
    link.download = `${fileName || `certificate_${index}`}.png`;
    link.href = certificateData;
    link.click();
  };

  // Reset all data
  const resetAll = () => {
    setTemplateImage(null);
    setTemplatePreview(null);
    setExcelData([]);
    setHeaders([]);
    setGeneratedCertificates([]);
    setFieldPositions({});
    setPlacedFields([]);
    setSelectedField(null);
    setError('');
    setSuccess('');
    setImageDimensions({ width: 0, height: 0 });
    setSelectedHeaders([]);
    setShowHeaderSelection(false);
  };

  return (
    <Container fluid className="py-4">
      <h1 className="text-center mb-4" style={{ color: '#2c3e50' }}>📜 Certificate Generator</h1>
      
      {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
      {success && <Alert variant="success" onClose={() => setSuccess('')} dismissible>{success}</Alert>}

      <Row className="mb-4">
        <Col md={7}>
          <Card className="h-100">
            <Card.Header as="h5" style={{ backgroundColor: '#f8f9fa' }}>
              <div className="d-flex justify-content-between align-items-center">
                <span>1. Upload Template Image</span>
                <Badge bg="info">PNG/JPG Supported</Badge>
              </div>
            </Card.Header>
            <Card.Body>
              <Form.Group>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={handleTemplateUpload}
                  className="mb-3"
                />
                {templatePreview && (
                  <div className="text-center">
                    <div 
                      ref={containerRef}
                      style={{ 
                        position: 'relative', 
                        display: 'inline-block',
                        width: '100%'
                      }}
                    >
                      <img 
                        ref={imageRef}
                        src={templatePreview} 
                        alt="Template" 
                        style={{ 
                          width: '100%',
                          height: 'auto',
                          cursor: 'crosshair',
                          border: '2px solid #dee2e6',
                          borderRadius: '5px'
                        }}
                        onLoad={handleImageLoad}
                        onMouseMove={handleMouseMove}
                        title="Hover to see coordinates"
                      />
                      
                      {/* Show placed fields on image */}
                      {headers.map(header => {
                        const pos = fieldPositions[header];
                        if (!pos) return null;
                        return (
                          <div
                            key={header}
                            style={{
                              position: 'absolute',
                              left: `${pos.x / imageScale.scaleX}px`,
                              top: `${pos.y / imageScale.scaleY}px`,
                              transform: 'translate(-50%, -50%)',
                              backgroundColor: 'rgba(255, 0, 0, 0.8)',
                              color: 'white',
                              padding: '2px 10px',
                              borderRadius: '4px',
                              fontSize: '14px',
                              fontWeight: 'bold',
                              pointerEvents: 'none',
                              zIndex: 10,
                              whiteSpace: 'nowrap',
                              border: '2px solid #ff0000'
                            }}
                          >
                            {header}
                          </div>
                        );
                      })}
                      
                      {/* Mouse position indicator */}
                      {templateImage && (
                        <div
                          style={{
                            position: 'absolute',
                            bottom: '10px',
                            right: '10px',
                            backgroundColor: 'rgba(0,0,0,0.7)',
                            color: 'white',
                            padding: '4px 10px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            zIndex: 20
                          }}
                        >
                          X: {mousePosition.x}, Y: {mousePosition.y}
                        </div>
                      )}
                    </div>
                    <div className="mt-2">
                      <Badge bg="success">Template Loaded</Badge>
                      <Badge bg="info" className="ms-2">
                        {imageDimensions.width}x{imageDimensions.height}
                      </Badge>
                      <Badge bg="warning" className="ms-2 text-dark">
                        {placedFields.length} fields placed
                      </Badge>
                    </div>
                    <p className="text-muted small mt-2">
                      💡 Hover on image to see coordinates. Update X/Y values below to position fields.
                    </p>
                  </div>
                )}
                {!templatePreview && (
                  <Alert variant="info">
                    Upload a PNG/JPG template image
                  </Alert>
                )}
              </Form.Group>
            </Card.Body>
          </Card>
        </Col>

        <Col md={5}>
          <Card className="h-100">
            <Card.Header as="h5" style={{ backgroundColor: '#f8f9fa' }}>
              <div className="d-flex justify-content-between align-items-center">
                <span>2. Upload Excel Data</span>
                <Badge bg="info">.xlsx/.xls</Badge>
              </div>
            </Card.Header>
            <Card.Body>
              <Form.Group>
                <Form.Control
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleExcelUpload}
                  className="mb-3"
                />
                {headers.length > 0 && (
                  <div>
                    <Alert variant="info">
                      <strong>Total Records:</strong> {excelData.length}
                    </Alert>
                    
                    {/* File Name Configuration */}
                    {showHeaderSelection && (
                      <Card className="mb-3">
                        <Card.Header as="h6" style={{ backgroundColor: '#d4edda' }}>
                          <div className="d-flex justify-content-between align-items-center">
                            <span>📝 File Name Configuration</span>
                            <Badge bg="success">{selectedHeaders.length} Headers Selected</Badge>
                          </div>
                        </Card.Header>
                        <Card.Body>
                          <Form.Label className="small">
                            Select headers to concatenate for filename (separated by _ ):
                          </Form.Label>
                          <div className="mb-2">
                            {fileNameHeaders.map((header, index) => (
                              <Form.Check
                                key={index}
                                inline
                                type="checkbox"
                                label={header}
                                checked={selectedHeaders.includes(header)}
                                onChange={() => toggleHeaderSelection(header)}
                                className="me-3"
                              />
                            ))}
                          </div>
                          <div className="mt-2 p-2 bg-light rounded">
                            <small className="text-muted">
                              Example: {selectedHeaders.length > 0 ? selectedHeaders.join('_') : 'Select headers above'}
                            </small>
                            <br />
                            <small className="text-muted">
                              Filename format: {selectedHeaders.length > 0 ? 'VALUE1_VALUE2_VALUE3.png' : 'certificate.png'}
                            </small>
                          </div>
                        </Card.Body>
                      </Card>
                    )}
                    
                    {/* Field Position Input Section */}
                    <Card className="mb-3">
                      <Card.Header as="h6" style={{ backgroundColor: '#e7f3ff' }}>
                        <div className="d-flex justify-content-between align-items-center">
                          <span>📌 Field Positions (X, Y)</span>
                          <Badge bg="primary">{placedFields.length}/{headers.length} Configured</Badge>
                        </div>
                      </Card.Header>
                      <Card.Body style={{ maxHeight: '300px', overflow: 'auto' }}>
                        {headers.map((header, index) => {
                          const pos = fieldPositions[header] || { x: 0, y: 0 };
                          
                          return (
                            <div key={index} className="mb-3 p-2 border rounded" style={{ backgroundColor: '#f8f9fa' }}>
                              <Form.Label className="fw-bold mb-1">{header}</Form.Label>
                              <Row>
                                <Col xs={6}>
                                  <Form.Group>
                                    <Form.Label className="small">X Position</Form.Label>
                                    <Form.Control
                                      type="number"
                                      value={pos.x || 0}
                                      onChange={(e) => updateFieldPosition(header, 'x', e.target.value)}
                                      size="sm"
                                    />
                                  </Form.Group>
                                </Col>
                                <Col xs={6}>
                                  <Form.Group>
                                    <Form.Label className="small">Y Position</Form.Label>
                                    <Form.Control
                                      type="number"
                                      value={pos.y || 0}
                                      onChange={(e) => updateFieldPosition(header, 'y', e.target.value)}
                                      size="sm"
                                    />
                                  </Form.Group>
                                </Col>
                              </Row>
                            </div>
                          );
                        })}
                      </Card.Body>
                    </Card>

                    {/* Preview Data */}
                    <div style={{ maxHeight: '150px', overflow: 'auto' }}>
                      <Table striped bordered hover size="sm">
                        <thead>
                          <tr>
                            {headers.slice(0, 4).map((header, idx) => (
                              <th key={idx}>{header}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {excelData.slice(0, 3).map((row, idx) => (
                            <tr key={idx}>
                              {headers.slice(0, 4).map((header, hidx) => (
                                <td key={hidx}>{row[header]}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                      {excelData.length > 3 && (
                        <p className="text-muted small">Showing first 3 records</p>
                      )}
                    </div>
                  </div>
                )}
                {headers.length === 0 && (
                  <Alert variant="secondary">
                    Upload an Excel file (.xlsx or .xls) containing student data
                  </Alert>
                )}
              </Form.Group>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {templateImage && headers.length > 0 && (
        <Row className="mb-4">
          <Col>
            <div className="d-flex gap-2 justify-content-center flex-wrap">
              <Button 
                variant="primary" 
                onClick={generateCertificates}
                disabled={isProcessing || placedFields.length === 0 || selectedHeaders.length === 0}
                size="lg"
              >
                {isProcessing ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Generating...
                  </>
                ) : (
                  '🎯 Generate Certificates'
                )}
              </Button>
              <Button variant="success" onClick={downloadAllAsZip} disabled={generatedCertificates.length === 0 || isProcessing} size="lg">
                {isProcessing ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Zipping...
                  </>
                ) : (
                  '📦 Download All (ZIP)'
                )}
              </Button>
              <Button variant="danger" onClick={resetAll} size="lg">
                🔄 Reset All
              </Button>
            </div>
            {placedFields.length === 0 && (
              <p className="text-center text-warning mt-2">
                ⚠️ Please upload Excel data first
              </p>
            )}
            {selectedHeaders.length === 0 && placedFields.length > 0 && (
              <p className="text-center text-warning mt-2">
                ⚠️ Please select at least one header for filename
              </p>
            )}
            {placedFields.length > 0 && selectedHeaders.length > 0 && (
              <p className="text-center text-success mt-2">
                ✅ {placedFields.length} fields configured! {selectedHeaders.length} headers selected for filename.
              </p>
            )}
          </Col>
        </Row>
      )}

      {generatedCertificates.length > 0 && (
        <Row>
          <Col>
            <Card>
              <Card.Header as="h5" className="d-flex justify-content-between align-items-center" style={{ backgroundColor: '#f8f9fa' }}>
                <span>Generated Certificates ({generatedCertificates.length})</span>
                <div>
                  <Button 
                    variant="success" 
                    size="sm" 
                    onClick={downloadAllAsZip}
                    className="me-2"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-1" />
                        Zipping...
                      </>
                    ) : (
                      '📦 Download All (ZIP)'
                    )}
                  </Button>
                </div>
              </Card.Header>
              <Card.Body>
                <Row xs={1} md={2} lg={3} xl={4} className="g-4">
                  {generatedCertificates.map((cert, index) => (
                    <Col key={index}>
                      <Card className="h-100">
                        <Card.Img 
                          variant="top" 
                          src={cert.data} 
                          alt={`Certificate ${index + 1}`}
                          style={{ height: '200px', objectFit: 'cover' }}
                        />
                        <Card.Body>
                          <Card.Title className="text-center">
                            <Badge bg="primary">#{index + 1}</Badge>
                          </Card.Title>
                          <div className="text-center mb-2">
                            <small className="text-muted">
                              {cert.fileName}.png
                            </small>
                          </div>
                          <div className="d-grid gap-2">
                            <Button 
                              variant="outline-primary" 
                              size="sm"
                              onClick={() => downloadCertificate(cert.data, cert.fileName, index + 1)}
                            >
                              📥 Download
                            </Button>
                            <Button 
                              variant="outline-secondary" 
                              size="sm"
                              onClick={() => window.open(cert.data, '_blank')}
                            >
                              👁️ Preview
                            </Button>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Hidden canvas for processing */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </Container>
  );
};

export default CertificateGenerator;