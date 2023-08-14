from wolframclient.evaluation import WolframLanguageSession
from wolframclient.language import wl
from wolframclient.language.expression import WLFunction, WLSymbol
from wolframclient.utils import datastructures

from decimal import Decimal

import pandas as pd
import numpy as np
import math
import json
import sys

Time = wl.MixedUnit(['Years', 'Days', 'Hours', 'Minutes', 'Seconds'])

property_map = {
    'AtomicNumber': None,
    'Name': None,
    'AtomicSymbol': None,
    # 'TermSymbol': None, # ----------------------------- Not supported
    'Period': None,
    'Group': None,
    'Block': None,
    'Series': None,

    'Price': 'USDollars / Kilogram',
    'EntityClasses': None,
    # 'Memberships': None, # -------------------- Duplicate
    # 'Image': None, # ---------------------------------- Not supported
    # 'LewisDotStructureDiagram': None, #---------------- Not supported


    'Origins': None,
    

    # # Atomic Properties
    'AtomicMass': 'AtomicMassUnit',
    # 'MolarMass': 'Grams / Mole', # -------------------- Duplicate
    'AtomicRadius': 'Picometers',
    'NuclearRadius': 'Femtometers',
    'CovalentRadius': 'Picometers',
    # 'ElectronicConfiguration': None, # ---------------- Not supported
    # 'ShortElectronicConfiguration': None, # ----------- Not supported
    'ElectronShellConfiguration': None,
    # 'ValenceElectronCount': None, # ------------------- Redundant
    'OrbitalOccupationList': None,
    'IonizationEnergies': 'Kilojoules / Mole',
    'SpecificIonizationEnergies': 'Kilojoules / Gram',
    # 'QuantumNumbers': None, # ------------------------- Not supported
    'VanDerWaalsRadius': 'Picometers',
    'KnownOxidationStates': None,
    'MostCommonOxidationStates': None,

    # # Material Properties
    'BrinellHardness': 'Megapascals',
	'BulkModulus': 'Gigapascals',
	'Density': 'Grams / Centimeters^3',
    # 'MassDensity': 'Grams / Centimeters^3', # --------- Duplicate
	'LiquidDensity': 'Grams / Centimeters^3',
	'MohsHardness': None,
	'MolarVolume': 'Centimeters^3 / Mole',
	'PoissonRatio': None,
	'ShearModulus': 'Gigapascals',
	'SoundSpeed': 'Meters / Second',
	'ThermalConductivity': 'Watts / (Kelvin * Meter)',
	'ThermalExpansion': 'Kelvin^-1',
	'VickersHardness': 'Megapascals',
	'YoungModulus': 'Gigapascals',
    'TensileYieldStrength': 'Megapascals',
    'UltimateTensileStrength': 'Megapascals',
    'ThresholdFrequency': 'Hertz',

    # # Thermodynamic Properties
    'BoilingPoint': 'Kelvin',
    'MeltingPoint': 'Kelvin',
    # 'AdiabaticIndex': None, # ------------------------- Not supported
    'MolarHeatCapacity': 'Joules / (Mole * Kelvin)',
    'SpecificHeatCapacity': 'Joules / (Gram * Kelvin)',
    # 'SpecificHeat': 'Joules / (Gram * Kelvin)', # ----- Duplicate
    'FusionHeat': 'Kilojoules / Mole',
    'SpecificFusionHeat': 'Kilojoules / Gram',
    'SolidificationHeat': 'Kilojoules / Mole',
    'SpecificSolidificationHeat': 'Kilojoules / Gram',
    'VaporizationHeat': 'Kilojoules / Mole',
    'SpecificVaporizationHeat': 'Kilojoules / Gram',
    'CriticalTemperature': 'Kelvin',
    'CriticalPressure': 'Megapascals',
    'CuriePoint': 'Kelvin',
    'NeelPoint': 'Kelvin',
    'Phase': None,
    'SuperconductingPoint': 'Kelvin',
    'DebyeCharacteristicTemperature': 'Kelvin',
    'WorkFunction': 'Electronvolts',
    
    # # Electromagnetic Properties
    'Color': None,
    'ElectricalConductivity': 'Siemens / Meter',
	'ElectricalType': None,
	'MagneticType': None,
	'MassMagneticSusceptibility': 'Meters^3 / Kilogram',
	'MolarMagneticSusceptibility': 'Meters^3 / Mole',
	'RefractiveIndex': None,
    'Resistivity': 'Ohms * Meter',
	'VolumeMagneticSusceptibility': None,

    # # Abundance Properties
    'CrustAbundance': 'MassPercent',
    'CrustMolarAbundance': 'MolePercent',
	'HumanAbundance': 'MassPercent',
    'HumanMolarAbundance': 'MolePercent',
	'MeteoriteAbundance': 'MassPercent',
    'MeteoriteMolarAbundance': 'MolePercent',
	'OceanAbundance': 'MassPercent',
    'OceanMolarAbundance': 'MolePercent',
	'SolarAbundance': 'MassPercent',
    'SolarMolarAbundance': 'MolePercent',
	'UniverseAbundance': 'MassPercent',
    'UniverseMolarAbundance': 'MolePercent',

    # # Basic Chemical Properties
    'AllotropicMultiplicities': None,
	'CommonCompoundNames': None,
	'ElectronAffinity': 'Kilojoules / Mole',
    # 'ElectronCount': None, # -------------------------- Redundant
    # 'ProtonCount': None, # ---------------------------- Redundant
    # 'NeutronCount': None, # --------------------------- Not supported
	'Electronegativity': None,
	'GasAtomicMultiplicities': None,
	'Valence': None,

    # # Crystallographic Properties
    'CrystalStructure': None,
	'LatticeAngles': 'AngularDegrees',
	'LatticeConstants': 'Picometers',
	'SpaceGroupNumber': None,
	# 'SpaceGroup': None, # ----------------------------- Not supported
    # 'CrystalStructureImage': None, # ------------------ Not supported

    # # Nuclear Properties
    'DecayMode': None,
    'HalfLife': Time,
	# 'KnownIsotopes': None, # -------------------------- Not supported
	# 'StableIsotopes': None, # -------------------------- Not supported
    # 'UnstableIsotopes': None, # ------------------------ Not supported
	# 'IsotopeAbundances': None, # ---------------------- Not supported
	# 'IsotopeHalfLives': None, # ----------------------- Not supported
	# 'IsotopeLifetimes': None, # ----------------------- Not supported
	'NeutronCrossSection': 'Barns',
	'NeutronMassAbsorption': 'Meters^2 / Kilogram',
	'MolarRadioactivity': 'Terabecquerels / Mole',
	'SpecificRadioactivity': 'Terabecquerels / Gram',

    # # Compound Properties
    # 'CommonCompounds': None, # ------------------------- Not supported

    # # Names
    'Abbreviation': None,
	'AllotropeNames': None,
	'AlternateNames': None,
	'CASNumber': None,
	'IconColor': None,

    # # Discovery
    'DiscoveryCountries': None,
    'DiscoveryDate': None,
    'Discoverers': None,
}

properties = property_map.keys()

def round_sig_fig(value, sig_fig):
    if value == 0: return 0
    return round(value, int(sig_fig - 1 - math.log10(abs(value))))

def default(obj):
    if isinstance(obj, Decimal):
        return float(obj)
    if isinstance(obj, WLFunction) and obj.head == wl.MixedUnit:
        return obj.args[0]
    
    raise TypeError(f'Object of type {type(obj)} is not JSON serializable')

print('Creating Session')
with WolframLanguageSession() as session:

    def resolve_entry(entry):
        sys.stdout.write('█')
        sys.stdout.flush()
        return resolve(entry)

    def resolve(entry):
        if type(entry) == tuple:
            if len(entry) == 0: return None
            return tuple(resolve(i) for i in entry)
        if type(entry) == datastructures.immutabledict:
            if len(entry) == 0: return None
            return dict([resolve(e) for e in entry.items()])

        if type(entry) == WLFunction:
            if entry.head == wl.Missing:
                return None
            if entry.head == wl.EntityClass or \
               entry.head == wl.Entity:
                # Capitalize[CommonName[entry], "AllWords"]
                return session.evaluate(wl.Capitalize(wl.CommonName(entry), 'AllWords'))
            if entry.head == wl.RGBColor:
                return entry.args
            if entry.head == wl.DateObject:
                return entry.args
            if entry.head == wl.Quantity and entry.args[1] == 'Percent':
                return resolve(entry.args[0] / 100)
            if entry.head == wl.Rational:
                return resolve(entry.args[0] / entry.args[1])
            if entry.head == wl.Interval:
                return resolve(sum(entry.args[0]) / 2)
            if entry.head == wl.MixedMagnitude:
                return entry.args[0]
            
        if type(entry) == WLSymbol:
            if entry.name == '$Failed':
                return None
        
        if type(entry) == float or \
           type(entry) == int or \
           type(entry) == Decimal:
            return round_sig_fig(entry, 5)
        if type(entry) == str:
            return entry.title()
        
        raise Exception(f'NOT HANDLING {type(entry)}:\n{entry}')


    print('Fetching element data')
    # EntityValue["Element", properties]
    elements = session.evaluate(wl.EntityValue('Element', properties))
    print('Processing')

    df = pd.DataFrame(elements, columns=properties)

    for col in df:
        print(f'\n  {col.rjust(30)} ', end='')
        if property_map[col] != None:
            unit = property_map[col]
            # QuantityMagnitude[UnitConvert[data, unit]]
            df[col] = session.evaluate(wl.QuantityMagnitude(wl.UnitConvert(df[col], unit)))
        df[col] = df[col].apply(resolve_entry)

df = df.replace({np.nan: None})
print('\n')
print(df)

final_dict = {
    'units': property_map,
    'elements': df.to_dict(orient='records')
}

with open('element_data.json', 'w') as f:
    json.dump(final_dict, f, indent=4, default=default)
