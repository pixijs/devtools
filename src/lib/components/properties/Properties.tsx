import { usePixiStore } from '@lib/pages';
import React from 'react';
import { SectionContainer, SectionHeader, Title, TitleGroup } from '../Container';
import CollapsibleComponent from '../collapsible/Collapsible';
import { NumberInput, NumberProps } from './number/Number';
import { Slider, SliderProps } from './slider/Slider';
import { SwitchProps, Switcher } from './switch/Switch';
import { TextInput, TextProps } from './text/Text';
import { Vector2, Vector2Props } from './number/Vector2';
import { ButtonInput, ButtonProps } from './button/Button';
import { SelectInput, SelectProps } from './select/Select';
import { VectorX, VectorXProps } from './number/VectorX';
import { ColorInput, ColorProps } from './color/Color';

type PropertyTypes = 'boolean' | 'number' | 'range' | 'select' | 'text' | 'button' | 'vector2' | 'vectorX' | 'color';

type PropertyPropsMap = {
  boolean: SwitchProps;
  number: NumberProps;
  range: SliderProps;
  select: SelectProps;
  text: TextProps;
  button: ButtonProps;
  vector2: Vector2Props;
  vectorX: VectorXProps;
  color: ColorProps;
};

export type PropertyProps = {
  [K in PropertyTypes]: { type: K; propertyProps: PropertyPropsMap[K]; property: string };
}[PropertyTypes];

const Property: React.FC<PropertyProps> = ({ type, propertyProps }) => {
  switch (type) {
    case 'boolean':
      return <Switcher {...(propertyProps as SwitchProps)} />;
    case 'number':
      return <NumberInput {...(propertyProps as NumberProps)} />;
    case 'vector2':
      return <Vector2 {...(propertyProps as Vector2Props)} />;
    case 'range':
      return <Slider {...(propertyProps as SliderProps)} />;
    case 'select':
      return <SelectInput {...(propertyProps as SelectProps)} />;
    case 'text':
      return <TextInput {...(propertyProps as TextProps)} />;
    // case 'textarea':
    // case 'radio':
    case 'button':
      return <ButtonInput {...(propertyProps as ButtonProps)} />;
    case 'vectorX':
      return <VectorX {...(propertyProps as VectorXProps)} />;
    case 'color':
      return <ColorInput {...(propertyProps as ColorProps)} />;
    default:
      return <TextInput {...(propertyProps as TextProps)} />;
  }
};

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface PropertiesProps {}
const PropertiesComponent: React.FC<PropertiesProps> = () => {
  const currentValues = usePixiStore((state) => state.selectedNodeValues);
  const propertyPanel = usePixiStore((state) => state.selectedNodeProps);
  const bridge = usePixiStore((state) => state.bridge);

  const handlePropertyChange = (property: string, newValue: any) => {
    bridge(`
      window.__PIXI_DEVTOOLS_WRAPPER__.properties.setValue('${property}', ${newValue})
    `);
  };

  const sections: Record<string, PropertyProps[]> = {};

  // loop through the propertyPanel and create the sections
  propertyPanel.values.forEach((prop) => {
    if (!sections[prop.section]) {
      sections[prop.section] = [];
    }

    sections[prop.section].push({
      type: prop.type,
      propertyProps: {
        ...prop.propertyProps,
        value: currentValues[prop.property],
        onChange: (newValue: any) => handlePropertyChange(prop.property, newValue),
      },
      property: prop.property,
    } as PropertyProps);
  });

  return (
    <>
      <SectionContainer className="tree">
        <SectionHeader style={{ padding: '15px 12px' }}>
          <TitleGroup>
            <Title style={{ fontSize: '14px' }}>Properties</Title>
          </TitleGroup>
        </SectionHeader>
        {Object.keys(sections).map((section) => (
          <React.Fragment key={section}>
            <CollapsibleComponent title={section} contentWrap={'nowrap'}>
              <>
                {sections[section].map((property) => (
                  <Property
                    key={property.property}
                    propertyProps={{
                      ...(property.propertyProps as any),
                    }}
                    property={property.property}
                    type={property.type} // Update the type to exclude 'vectorX'
                  />
                ))}
              </>
            </CollapsibleComponent>
          </React.Fragment>
        ))}
      </SectionContainer>
    </>
  );
};

export default PropertiesComponent;
