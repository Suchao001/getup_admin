import React from 'react';
import { ColorPicker } from 'antd';

const CustomColorPicker = ({ color, onChange }) => {
  const handleColorChange = (newColor) => {
    const formattedColor = newColor.toHexString().substring(0, 7);
    onChange(formattedColor);
  };

  return (
    <div style={{ zIndex: 1500 ,display: 'flex',alignItems: 'center',overflow: 'auto'}}>
      <ColorPicker
        value={color}
        onChange={handleColorChange}
        presets={[
          {
            label: 'Recommended',
            colors: [
              '#000000',
              '#F5222D',
              '#FA8C16',
              '#FADB14',
              '#8BBB11',
              '#52C41A',
              '#13A8A8',
              '#1677FF',
              '#2F54EB',
              '#722ED1',
              '#EB2F96',
            ],
          },
        ]}
        getPopupContainer={(trigger) => trigger.parentElement}
      />
      <div style={{ display: 'flex', gap: '5px', marginTop: '10px' ,marginLeft: '10px',marginBottom: '10px'}}>
        {[
          '#000000',
          '#F5222D',
          '#FA8C16',
          '#FADB14',
          '#8BBB11',
          '#52C41A',
          '#13A8A8',
          '#1677FF',
          '#2F54EB',
          '#722ED1',
          '#EB2F96',
        ].map((c) => (
          <div
            key={c}
            style={{
              width: '20px',
              height: '20px',
              backgroundColor: c,
              cursor: 'pointer',
              borderRadius: '5px',
            }}
            onClick={() => onChange(c)}
          />
        ))}
      </div>
    </div>
  );
};

export default CustomColorPicker;
